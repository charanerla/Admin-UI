import React from "react"
import {BiEdit} from "react-icons/bi"
import {AiOutlineDelete} from "react-icons/ai"
import "./index.css"

const TableComponent = props => {

    const {tableDetails} = props
    const {onChangeInputs,deleteRow,setData,data,displayData}=tableDetails

    function changeChecked(id) {
        const updatedData = data.map(obj => {
            if (obj.id === id) {
                const newObj = { ...obj, isChecked: !obj.isChecked }
                return newObj
            } return obj
        })
        setData(updatedData)
    }

    const toggleAllCheckboxes = event => {
      const displayIds = displayData.map(obj => obj.id)
        if(event.target.checked){
          const updatedData = data.map(obj => {
            if(displayIds.includes(obj.id)){
              const newObj={...obj,isChecked:true}
              return newObj
            }return obj
          })
          setData(updatedData)
        }else{
          const updatedData = data.map(obj => {
            if(displayIds.includes(obj.id)){
              const newObj={...obj,isChecked:false}
              return newObj
            }return obj
          })
          setData(updatedData)
        }
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

export default TableComponent