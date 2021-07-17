export const ADD_TASK = "ADD_TASK"
export const REMOVE_TASK = "REMOVE_TASK"
export const EDIT_TASK = "EDIT_TASK"
export const ADD_CHECKOUT = "ADD_CHECKOUT"
export const EDIT_CHECKOUT_STATE = "EDIT_CHECKOUT_STATE"
export const RUN_STOP_TASK = "RUN_STOP_TASK"
export const RUN_STOP_ALL_TASKS = "RUN_STOP_ALL_TASKS"
export const REMOVE_ALL_TASKS = "REMOVE_ALL_TASKS"
export const ADD_CHECKOUT_BYPASS = "ADD_CHECKOUT_BYPASS"
export const USE_CHECKOUT_BYPASS = "USE_CHECKOUT_BYPASS"
export const EDIT_ALL_CHECKOUTS_STATE = "EDIT_ALL_CHECKOUTS_STATE"
export const defaultState = JSON.parse(localStorage.getItem('tasks')!)||{}
import {ActionType} from './index'
export const tasksReducer = (state = defaultState ,action:ActionType)=>{
    let currentState:any
    switch (action.type){
        case ADD_TASK:
            currentState = {...state, [action.payload.id]:{...action.payload,checkouts:{},checkoutsBypass:{},isRun:false}}
            localStorage.setItem("tasks",JSON.stringify(currentState))
            return currentState
        case REMOVE_TASK:
            currentState = {...state}
            delete currentState[action.payload.id]
            localStorage.setItem("tasks",JSON.stringify(currentState))
            return currentState
        case EDIT_TASK:
            currentState = {...state, [action.payload.id]:action.payload}
            localStorage.setItem("tasks",JSON.stringify(currentState))
            return currentState
        case ADD_CHECKOUT:
            currentState = {...state}
            currentState[action.payload.taskId].checkouts[action.payload.checkoutId] = action.payload.checkout
            return currentState
        case ADD_CHECKOUT_BYPASS:
            currentState = {...state}
            currentState[action.payload.taskId].checkoutsBypass[action.payload.checkoutBypassId] = {
                bypass:action.payload.checkoutBypass,
                used:false
            }
            return currentState
        case USE_CHECKOUT_BYPASS:
            currentState = {...state}
            currentState[action.payload.taskId].checkoutsBypass[action.payload.checkoutBypassId].used=true
            return currentState
        case RUN_STOP_TASK:
            currentState = {...state}
            currentState[action.payload.taskId].isRun = action.payload.isRun
            Object.keys(currentState[action.payload.taskId].checkouts).map(checkout=>currentState[action.payload.taskId].checkouts[checkout].Stop=!action.payload.isRun)
            Object.keys(currentState[action.payload.taskId].checkoutsBypass).map(bypass=>currentState[action.payload.taskId].checkoutsBypass[bypass].Stop=!action.payload.isRun)
            return currentState
        case EDIT_CHECKOUT_STATE:
            currentState = {...state}
            currentState[action.payload.taskId].currentCheckoutState = action.payload.message
            return currentState
        case EDIT_ALL_CHECKOUTS_STATE:
            currentState = {...state}
            Object.keys(currentState).map(task=>{
                currentState[task].currentCheckoutState=action.payload.message
            })
            return currentState
        case REMOVE_ALL_TASKS:
            localStorage.setItem("tasks",JSON.stringify({}))
            return {}
        case RUN_STOP_ALL_TASKS:
            currentState = {...state}
            Object.keys(currentState).map(task=>{
                currentState[task].isRun=action.payload.isRun
                Object.keys(currentState[task].checkouts).map(checkout=>currentState[task].checkouts[checkout].Stop=!action.payload.isRun)
                Object.keys(currentState[task].checkoutsBypass).map(bypass=>currentState[task].checkoutsBypass[bypass].Stop=!action.payload.isRun)
            })
            return currentState
        default:
            return state
    }
}

