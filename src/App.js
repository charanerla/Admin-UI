import React, {useState,useEffect} from "react"
import {TailSpin} from "react-loader-spinner"
import {BiEdit} from "react-icons/bi"
import {AiOutlineDelete,AiOutlineLeft,AiOutlineRight} from "react-icons/ai"
import './App.css';

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

const App = () => {
  const [data,setData]=useState([])
  const [apiStatus,setApiStatus]=useState(apiStatusConstants.initial)
  const [userInput,setUserInput]=useState("")
  const [pagesCount,setPagesCount]=useState(Math.ceil(data.length/10))
  const [activeButton,setActiveButton] = useState(1)

  

  useEffect(()=>{
    setApiStatus(apiStatusConstants.inProgress)
    const fetchingData = async () => {
      const url="https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json"
      const response = await fetch(url)
      const apiData = await response.json()
      // console.log(response)
      if (response.ok){
        const updatedData = apiData.map(obj => ({...obj,"isEditable":false,"isChecked":false}))
        setData(updatedData)
        setPagesCount(Math.ceil(updatedData.length/10))
        setApiStatus(apiStatusConstants.success)
      }
      else{
        setApiStatus(apiStatusConstants.failure)
      }
    }
    fetchingData()
  },[])




  const filteredDataCount = event => {
    const filterValue=event.target.value.toLowerCase()
    const filteredData = data.filter(obj=>{
      if((obj.email.toLowerCase().includes(filterValue)) ||(obj.name.toLowerCase().includes(filterValue)) || (obj.role.toLowerCase().includes(filterValue))){
        return obj 
      }
    })
    setPagesCount(Math.ceil(filteredData.length/10))
  }



  const searchBar = () => <input type="search" className="search-input" placeholder="Search by name, email, or role" onChange={event =>{setUserInput(event.target.value);filteredDataCount(event);setActiveButton(1)}} />



  const renderLoader = () => <div className="loader-container">
    <TailSpin width="50px" height="50px" color="#000000" />
  </div>




  const onChangeInputs = (event,id,index) => {
    const inputsNames=event.target.name
    // console.log(inputsNames)
    const newData = data.map(obj => {
      if(obj.id===id){
        const newObj = {...obj}
        newObj[inputsNames]=event.target.value
        return newObj
      }return obj
    })
    setData(newData)
  }




  const toggleEditability = id => {
    const updatedData = data.map(obj =>{
      if(obj.id===id){
        const newObj={...obj,isEditable:!obj.isEditable}
        return newObj
      }
      return obj
  })
    setData(updatedData)
  }




  const changeChecked = id => {
    const updatedData = data.map(obj => {
      if(obj.id===id){
        const newObj = {...obj,isChecked:!obj.isChecked}
        return newObj
      }return obj
    })
    setData(updatedData)
  }




  const toggleAllCheckboxes = event => {
    if(event.target.checked){
      const updatedData = data.map(obj => ({...obj,isChecked:true}))
      setData(updatedData)
    }else{
      const updatedData = data.map(obj => ({...obj,isChecked:false}))
      setData(updatedData)
    }
  }




  const deleteRow = id => {
    const updatedData = data.filter(obj=>obj.id!==id)
    setData(updatedData)
    setPagesCount(Math.ceil(updatedData.length/10))
  }




  const renderTable = () => {
    const filterValue=userInput.toLowerCase()
    const filteredData = data.filter(obj=>{
      if((obj.email.toLowerCase().includes(filterValue)) ||(obj.name.toLowerCase().includes(filterValue)) || (obj.role.toLowerCase().includes(filterValue))){
        return obj 
      }
    })
    let displayData;
    if (activeButton===1){
      displayData = filteredData.filter((obj,index)=>{if(index<10){return obj}})
    }else{
      const stringNumber=`${activeButton}0`
      const startIndex = parseInt(stringNumber)-10
      const endIndex = parseInt(stringNumber)
      displayData = filteredData.filter((obj,index)=>{if(index>=startIndex && index<endIndex){return obj}})
    }
    
    return(<table className="table" >
  <thead>
    <tr>
      <th scope="col"><input type="checkbox" onChange={event => toggleAllCheckboxes(event)} className="checkboxs" /></th>
      <th scope="col">Name</th>
      <th scope="col">Email</th>
      <th scope="col">Role</th>
      <th scope="col">Actions</th>
    </tr>
  </thead>
  <tbody>
    {displayData.map((info,index) => <tr key={info.id}>
      <td><input type="checkbox" checked={info.isChecked} onChange={() => changeChecked(info.id)} className="checkboxs"  /></td>
      <td>{info.isEditable?<input type="text" name="name" value={info.name} className="user-input" onChange={event=>onChangeInputs(event,info.id,index)} />:<p className="para">{info.name}</p>}</td>
      <td>{info.isEditable?<input type="text" name="email" value={info.email} className="user-input" onChange={event=>onChangeInputs(event,info.id,index)}  />:<p className="para">{info.email}</p>}</td>
      <td>{info.isEditable?<input type="text" name="role" value={info.role} className="user-input" onChange={event=>onChangeInputs(event,info.id,index)}  />:<p className="para">{info.role}</p>}</td>
      <td>
        <button type="button" className="buttons" onClick={()=>toggleEditability(info.id)}><BiEdit color={info.isEditable?"#0000FF":null}/></button>
        <button type="button" className="buttons" onClick={()=>deleteRow(info.id)}><AiOutlineDelete color="red"/></button>
      </td>
    </tr>)}
  </tbody>
</table>)}




  const renderSuccessView = () => <>
  {renderTable()}
  </>




  const renderFailureView = () => <div className="failure-view"><h1>Please Check the url's</h1></div>

  const renderingResult = () => {
    switch (apiStatus) {
      case apiStatusConstants.success:
        return renderSuccessView()
      case apiStatusConstants.inProgress:
        return renderLoader()
      case apiStatusConstants.failure:
        return renderFailureView()
      default:
        return null;
    }
  }

  const changeActiveFunction = number => setActiveButton(number)
  


  const renderPagesButtons = () => {
    let pages = []
    if (pagesCount>1){
      for(let count=1;count<=pagesCount;count++){
        pages.push(count)
      }
    }
  if (pages.length===0){
    return null
  }
    return <>{
      pages.map(page => <button className={activeButton===page?"active-btn":"non-active-btn"} onClick={()=>changeActiveFunction(page)} key={page}>{page}</button>)
    }</>
    
  }

  return <div className="main-container">
    {searchBar()}
    {renderingResult()}
    <div className="page-buttons-container">
      {pagesCount>1 && <button className={activeButton>1?"active-arrow":"unActive-arrow"} onClick={()=>{activeButton>1&&setActiveButton(prevSta=>prevSta-1)}} ><AiOutlineLeft/></button>}
    {renderPagesButtons()}
    {pagesCount>1 && <button className={activeButton<pagesCount?"active-arrow":"unActive-arrow"} onClick={()=>{activeButton<pagesCount&&setActiveButton(prevSta=>prevSta+1)}} ><AiOutlineRight/></button>}
    </div>
  </div>
}

export default App;
