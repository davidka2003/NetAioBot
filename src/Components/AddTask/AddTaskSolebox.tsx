import React, { ChangeEvent, FormEvent } from 'react'
import {useState} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Dispatch } from 'redux'
import { ProfileInterface, SoleboxTaskInterface } from '../../Interfaces/interfaces'
import { ADD_SOLEBOX_TASK } from '../../store/tasksReducer'
import {sizes} from './AddTask'
const AddTaskSolebox = () => {
    const dispatch:(arg:{type:string,payload:any})=>Dispatch<typeof arg> = useDispatch()
    const profiles:{[key:string]:ProfileInterface} = useSelector((state:any)=>state.profiles)
    const proxyProfiles = useSelector((state:any)=>state.proxy)
    const [task, settask] = useState<SoleboxTaskInterface>({isCustomSizes:false,sizes:{},__taskNumber:1,checkoutsAmount:1,isRun:false,retryOnFailure:true,shopType:'solebox'})
    const handleChange = (event:ChangeEvent<HTMLInputElement&/* | */HTMLSelectElement>)=>{
        let currentTask = {...task}
        switch (event.target.id) {
            case "url":
                currentTask.url = event.target.value
                break;
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
            case "__taskNumber":
                currentTask.__taskNumber = parseInt(event.target.value)
                break
            case "retryOnFailure":
                currentTask.retryOnFailure = event.target.checked
                break
            case "checkoutsAmount":
                currentTask.checkoutsAmount = parseInt(event.target.value)
                break
            default:
                event.target.name == "sizes"?currentTask.sizes[event.target.id] = event.target.checked:null
                break;
        }
        console.log(currentTask)
        settask(currentTask)
    }
    const handleCreate = (event:FormEvent<HTMLFormElement>)=>{
        event.preventDefault()
        dispatch({type:ADD_SOLEBOX_TASK,payload:{...task,shop:"solebox",currentCheckoutState:{level:"LOW",state:"not started"}}})

    }
    return (
        <div className="container row">
        <div className="container col-1" />
        <div className="container col-10">
        <form onSubmit={handleCreate} className="needs-validation" id="createTaskForm">
            <div className="row g-6">
            <h2 className=" text-center">Solebox</h2>
            <div className="col">
                <label htmlFor="url" className="form-label ">Product Link</label>
                <input onChange={handleChange} value={task.url}type="text" className="net_input" id="url" required />
            </div>
            </div>
            <br />
            <div className="col ">
            <div className="form-check form-switch">
                <input className="form-check-input" type="checkbox" checked = {task?.isCustomSizes}onChange={handleChange} name="flexRadioDefault" id="isCustomSizes" data-bs-toggle="collapse" href="#collapseSolebox" aria-expanded="false" aria-controls="collapseExample" />
                <label className="form-check-label" htmlFor="flexSwitchCheckDefault">Use preferred sizes</label>
            </div>
            <div>
                <div className="collapse text-dark" id="collapseSolebox">
                <div className="card card-body">
                {
                    sizes?.map((size:string,index)=>{
                        return (
                            <div className="form-check" key={index}>
                            <input className="form-check-input" onChange={handleChange} checked = {task.sizes[size]?.checked} id={size} name="sizes" type="checkbox" />
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
            <div className="row g-3">
            <div className="col">
                <label htmlFor="number" className="form-label ">Number of tasks</label>
                <input onChange={handleChange} value={task?.__taskNumber} type="number" min="1" max="100" className="net_input" id="__taskNumber" required />
            </div>
            <div className="col">
                <label htmlFor="profile" className="form-label ">Profile</label>
                <select value={task?.profile} onChange={handleChange} className="net_select" id="profile" required={true}>
                <option value="">Выбрать...</option>
                {
                    Object.keys(profiles||{})?.map((profile,index)=>{
                        return(
                            <option value={profile} key={index}>{profile}</option>
                        )
                    })
                }
                </select>
            </div>
            <div className="col">
                <label htmlFor="mode" className="form-label ">Mode</label>
                <select value={task?.mode} onChange={handleChange} className="net_select" id="mode" required={true}>
                    <option value="">Выбрать...</option>
                    <option>release</option>
                    <option>24/7</option>
                </select>
            </div>
            <div className="col">
                <label htmlFor="proxyProfile" className="form-label ">Прокси</label>
                <select value={task?.proxyProfile} onChange={handleChange} className="net_select" id="proxyProfile" required={true}>
                    <option value="">Выбрать...</option>
                    {Object.keys(proxyProfiles).map((profile:string,index)=><option key={index} value={profile}>{profile}</option>)}
                </select>
            </div>
            </div>
            <br />
            <button className="net_button_primary" id="newSoleboxTaskButton">Save</button>
            <br />
        </form>
        </div>
        <div className="container col-1" />
    </div>

    )
}

export default AddTaskSolebox
