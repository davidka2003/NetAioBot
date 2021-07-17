import { useDispatch, useSelector } from 'react-redux'
import React from 'react'
import { ShopifyMonitor } from '../../scripts/shopify/shopify'
import { EDIT_CHECKOUT_STATE, REMOVE_TASK, RUN_STOP_TASK } from '../../store/tasksReducer'
import console from 'console'
export const LOW = "white"
export const ERROR = "red"
export const SUCCESS = "green"
const message = {
  LOW,ERROR,SUCCESS
}
const Task = (props:{id:string,callEdit:Function})=>{
    const dispatch = useDispatch()
    const tasks = useSelector((state:any)=>state.tasks)
  
    let handleDelete =()=>{
      dispatch({type:RUN_STOP_TASK,payload:{taskId:props.id,isRun:false}})
      dispatch({type:REMOVE_TASK,payload:{...tasks[props.id]}})
    }
    let handleEdit = (id:string)=>{
      props.callEdit(id)
    }
    let handleStart = ()=>{
      switch (tasks[props.id].shop){
        case 'shopify':
          !Object.keys(tasks).filter(taskId=>tasks[taskId].isRun&&tasks[taskId].shop=='shopify'==true).length? new ShopifyMonitor().Parse():null
          break
        case 'solebox':
          console.log('solebox')
          break
        default:
          throw new Error("There is now such shop")
      }
      dispatch({type:RUN_STOP_TASK,payload:{taskId:props.id,isRun:true}})

    }
    let handleStop = ()=>{
      dispatch({type:EDIT_CHECKOUT_STATE,payload:{taskId:props.id,message:{level:"ERROR",state:"stop"}}})
      dispatch({type:RUN_STOP_TASK,payload:{taskId:props.id,isRun:false}})
    }

    return(
      <tr className = "text-light" key={props.id}>
      <td>{tasks[props.id].shop}</td>
      <td>{'+: ' + tasks[props.id].positive.join("|")} <br/> {'-: ' + tasks[props.id].negative.join("|")}</td>
      <td>{tasks[props.id].mode}</td>
      <td style={{color:
        message[tasks[props.id].currentCheckoutState?.level]||"white"}
      }>{tasks[props.id].currentCheckoutState?.state}</td>
      <td>
        <div className = 'btn-group'>
          <button onClick={handleStart} className = 'btn btn-outline-secondary btn-md text-light' id = 'starttasks'>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-caret-right" viewBox="0 0 16 16">
              <path d="M6 12.796V3.204L11.481 8 6 12.796zm.659.753 5.48-4.796a1 1 0 0 0 0-1.506L6.66 2.451C6.011 1.885 5 2.345 5 3.204v9.592a1 1 0 0 0 1.659.753z"/>
            </svg>
          </button>
          <button onClick={handleStop} className = 'btn btn-outline-secondary btn-md text-light' id = 'stoptasks'>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pause-fill" viewBox="0 0 16 16">
              <path d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5zm5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5z"/>
            </svg>
          </button>
          <button className='btn btn-outline-secondary btn-md text-light' onClick={handleDelete} id = 'DeleteTask'>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
              <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
              <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
            </svg>
          </button>
          <button className='btn btn-outline-secondary btn-md text-light' onClick={()=>handleEdit(props.id)} data-bs-toggle="modal" data-bs-target="#EditShopifyTask">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil" viewBox="0 0 16 16">
            <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5L13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175l-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
          </svg>
          </button>
        </div>
      </td>
    </tr>
  
    )
  
  } 
 
export default Task