import { ipcRenderer } from 'electron'
import React, { ChangeEvent, FormEvent } from 'react'
import {useState} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ShopifyTaskInterface,SoleboxTaskInterface } from '../../Interfaces/interfaces'
import { ShopifyMonitor } from '../../scripts/shopify/shopify'
import { EDIT_ALL_CHECKOUTS_STATE, EDIT_TASK, REMOVE_ALL_TASKS, RUN_STOP_ALL_TASKS } from '../../store/tasksReducer'
import { sizes } from '../AddTask/AddTask'
import Task from './Task'
import { SITES } from '../../scripts/shopify/shopifyConfig'
import Select from 'react-select'
const Tasks = () => {
  const dispatch = useDispatch()
  const tasks = useSelector((state:any)=>state.tasks)
  const proxyProfiles = useSelector((state:any)=>state.proxy)
  const profiles = useSelector((state:any)=>state.profiles)
  
  const [edit, setedit] = useState<ShopifyTaskInterface|SoleboxTaskInterface>({isCustomSizes:false,__taskNumber:1,sizes:{},isRun:false,retryOnFailure:false,checkoutsAmount:1,shopType:'shopify'})
  const siteOptions = Object.keys(SITES).map(site=>{
    return{
        value:site,
        label:site?.replace(/https:\/\/|https:\/\/|\/|www./g,"")
    }
  })
  const handleSiteSelect = (event:{value:string,label:string})=>{
    let currentTask = {...edit}
    currentTask.shopUrl = event.value
    setedit(currentTask)
  }

  const editTask = (id:string)=>{
    setedit({...tasks}[id])

  }
  let saveEdited = (event:FormEvent)=>{
    event.preventDefault()
    dispatch({type:EDIT_TASK,payload:{...edit}})
}
  const handleChange = (event:ChangeEvent<HTMLInputElement>)=>{
    // console.log(task)
    let currentTask = /* {...task} */{...edit}
    console.log(edit)
    switch(event.target.id){
      case 'positive':
        currentTask.positive = event.target.value.split("|")
        break
      case 'negative':
        currentTask.negative = event.target.value.split("|")
        break
      case "isCustomSizes":
        currentTask.isCustomSizes = event.target.checked
        break;
      case "mode":
        currentTask.mode=event.target.value
        break
      case "profile":
        currentTask.profile=event.target.value
        break
      case "proxyProfile":
        currentTask.proxyProfile=event.target.value
        break
      case "retryOnFailure":
        currentTask.retryOnFailure = event.target.checked
        break
      case "checkoutsAmount":
        currentTask.checkoutsAmount = parseInt(event.target.value)
        break
      case "__taskNumber":
        currentTask.__taskNumber = parseInt(event.target.value)
        break
      case "url":
        currentTask.url = event.target.value
        break
      case "shopUrl":
        currentTask.shopUrl = event.target.value
        break
      default:
        event.target.name == "sizes"?currentTask.sizes[event.target.id] = event.target.checked:null
        break;
    }
    setedit(currentTask)
    console.log(edit)

  }
  const handleStartAll = ()=>{
    dispatch({type:EDIT_ALL_CHECKOUTS_STATE,payload:{message:{level:"LOW",state:"started"}}})
    if(!Object.keys(tasks).filter(taskId=>tasks[taskId].isRun&&tasks[taskId].shop=='shopify'==true).length) {
      for (let url of Object.keys(SITES)) new ShopifyMonitor(url).Parse()
    }/* add for solebox */
dispatch({type:RUN_STOP_ALL_TASKS,payload:{isRun:true}})
  }
  const handleStopAll = ()=>{
    dispatch({type:EDIT_ALL_CHECKOUTS_STATE,payload:{message:{level:"ERROR",state:"stopped"}}})
    dispatch({type:RUN_STOP_ALL_TASKS,payload:{isRun:false}})
  }
  const handleDeleteAll = ()=>{
    dispatch({type:RUN_STOP_ALL_TASKS,payload:{isRun:false}})
    dispatch({type:REMOVE_ALL_TASKS,payload:{}})
  }
  return (
      <div className="tab-pane fade show active" id="v-pills-tasks" role="tabpanel" aria-labelledby="v-pills-tasks-tab">
        <div className="container ">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Category</th>
                <th>Filters</th>
                <th>Mode</th>
                <th>State</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody id = 'tasksTable'>
              {
<<<<<<< HEAD
=======

>>>>>>> 9365023423d73cbfab38422012f1f43a2b588649
                Object.keys(tasks)?.map((id:string)=>{
                  return (<Task id={id} key={id} callEdit={editTask}/>)
                })
              }
            </tbody>
          </table>
          {}
          <div className='container'>
            <div className='task_buttons_container'>
              <button onClick={handleStartAll} className = 'net_button_success tasks_buttons' id = 'startAllTasks' >Run</button>
              <button onClick={handleStopAll} className = 'net_button_danger tasks_buttons' id = 'stopAllTasks'>Stop</button>
              <button onClick={handleDeleteAll} className = 'net_button_secondary tasks_buttons' id = 'throwoffAllTasks'>Reset</button>
            </div>
          </div>

        </div>
        <div className="modal fade" id="EditShopifyTask" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-labelledby="staticBackdropLabel" aria-hidden="true">
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Редактирование таска</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
              </div>
              <div className="modal-body">
                <form onSubmit={(event)=>saveEdited(event)} className="container needs-validation" id="editTaskForm">
                  {
                    (()=>{
                      switch (edit.shopType) {
                        case "shopify":
                          return(
                            <div className="row g-6">
                            <h5>Filters</h5>
                            <div className="col">
                              <label htmlFor="positive" className="form-label">Positive</label>
                              <input onChange={handleChange} value={edit.positive?.join("|")} type="text" className="form-control" id="positive" required />
                            </div>
                            <div className="col">
                              <label htmlFor="negative" className="form-label">Negative</label>
                              <input onChange={handleChange} value={edit.negative?.join("|")} type="text" className="form-control" id="negative" required />
                            </div>
                            <h5>Site</h5>
                            <Select
                                classNamePrefix="select"
                                defaultValue={siteOptions[0]}
                                onChange={handleSiteSelect}
                                className="net_select" 
                                id="shopUrl"
                                value={{
                                    value:edit.shopUrl,
                                    label:edit.shopUrl?.replace(/https:\/\/|https:\/\/|\/|www./g,"")
                                }}
                                isSearchable={true}
                                name="color"
                                options={siteOptions}
                                required
                                />
                          </div>

                          )
                        case "solebox":
                          return(
                            <div className="row g-6">
                            <div className="col">
                              <label htmlFor="url" className="form-label">Url</label>
                              <input onChange={handleChange} value={edit.url} type="text" className="form-control" id="url" required />
                            </div>
                          </div>

                          )
                        default:
                          return
                      }
                    })()
                  }
                  <br />
                  <div className="col">
                    {/* <div className="form-check">
                      <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1" defaultChecked />
                      <label className="form-check-label" htmlFor="flexRadioDefault1">
                        Все размеры
                      </label>
                    </div> */}
                    <div className="form-check form-switch">
                      <input className="form-check-input" type="checkbox" checked={edit.isCustomSizes} onChange={handleChange} name="flexRadioDefault" id="isCustomSizes" data-bs-toggle="collapse" href="#editSize" role="button" aria-expanded="false" aria-controls="editSize" />
                      <label className="form-check-label" htmlFor="isCustomSizes">
                        Custom sizes
                      </label>
                    </div>
                    <div>
                      <div className="collapse text-dark" id="editSize">
                        <div className="card card-body">
                        {
                                    sizes?.map((size:string,index)=>{
                                        return (
                                            <div className="form-check" key={index}>
                                            <input onChange={handleChange} className="form-check-input"  checked = {edit.sizes[size]} id={size} name="sizes" type="checkbox" />
                                            <label className="form-check-label" htmlFor={size +'us'}>
                                                {size} us
                                            </label>
                                            </div>
                                        )
                                    })
                                }
                        </div>
                      </div>
                    </div>
                  </div>
                  <br />
                  <div className="row g-6">
                    <h5>Settings</h5>
                    <div className="col">
                      <label htmlFor="profile" className="form-label">Profile</label>
                      <select onChange={handleChange} value = {edit.profile} className="form-select" id="profile" required>
                        <option disabled={true}>Select...</option>
                        {Object.keys(profiles).map((profile:string,index)=><option key={index} value={profile}>{profile}</option>)}
                      </select>
                    </div>
                    <div className="col">
                      <label htmlFor="mode" className="form-label">Mode</label>
                      <select onChange={handleChange} value={edit.mode}className="form-select" id="mode" required>
                        <option disabled={true}>Select...</option>
                        <option value="release">release</option>
                        <option value="24/7">24/7</option>
                      </select>
                    </div>
                    <div className="col">
                      <label htmlFor="mode" className="form-label">Proxy</label>
                      <select onChange= {handleChange} value={edit.proxyProfile} className="form-select" id="proxyProfile" required>
                        <option value="">Select...</option>
                        {Object.keys(proxyProfiles).map((profile:string,index)=><option key={index} value={profile}>{profile}</option>)}
                      </select>
                    </div>
                    <div className="col">
                            <label htmlFor="checkoutsAmount" className="form-label">Checkouts per task amount</label>
                            <input onChange={handleChange} value={edit?.checkoutsAmount} type="number" min="1" max="100" className="form-control" id="checkoutsAmount" required />
                        </div>
                    <div className="col">
                        <label htmlFor="retryOnFailure" className="form-label">Retry on failure</label>
                        <input onChange={handleChange} checked={edit?.retryOnFailure} type="checkbox" className="form-check-input" id="retryOnFailure" />
                    </div>

                  </div>
                  <br />
                  <button className="btn btn-primary" id="editShopifyTaskButton">Save edits</button>
                  <br />
                </form>
              </div>
            </div>
          </div>
          </div>
      </div>
  )
}


export default Tasks
