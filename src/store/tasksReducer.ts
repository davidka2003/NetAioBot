import {v4 as id} from 'uuid'
export const ADD_SHOPIFY_TASK = "ADD_SHOPIFY_TASK"
export const ADD_SOLEBOX_TASK = "ADD_SOLEBOX_TASK"
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
export const defaultState:{[key:string]:ShopifyTaskInterface} = JSON.parse(localStorage.getItem('tasks')!)||{}
const {SITES} = require('../scripts/shopify/shopifyConfig.json')
import {ActionType} from '.'
import { ShopifyTaskInterface, SoleboxTaskInterface } from '../Interfaces/interfaces'

let checkoutsBypass=<any>{}
Object.keys(SITES).forEach(site=>checkoutsBypass[site]={})
export const tasksReducer = (state = defaultState ,action:ActionType)=>{
    let currentState:typeof state
    // let checkoutsBypass=<any>{}
    let currentStorage=<any>{}
    let currentTasks = <{[key:string]:ShopifyTaskInterface}>{}
    // let checkoutsBypass=<any>{}
    switch (action.type){
        case ADD_SOLEBOX_TASK:
            /* same as edit */
            for(let i =0; i<action.payload.__taskNumber;i++) {
                let taskId = id()
                currentTasks = {...currentTasks,[taskId]:{...action.payload,checkouts:{},isRun:false,id:taskId}}
            }
            currentStorage = {...JSON.parse(localStorage.getItem('tasks')||"{}"),...currentTasks}
            currentState = {...state,...currentTasks}
            localStorage.setItem("tasks",JSON.stringify(currentStorage))
            return currentState

        case ADD_SHOPIFY_TASK:
            /* same as edit */
            // Object.keys(SITES).forEach(site=>checkoutsBypass[site]={})
            for(let i =0; i<action.payload.__taskNumber;i++) {
                let taskId = id()
                currentTasks = {...currentTasks,[taskId]:{...action.payload,checkouts:{},checkoutsBypass,isRun:false,id:taskId}}
            }
            currentStorage = {...JSON.parse(localStorage.getItem('tasks')||"{}"),...currentTasks}
            // console.log(currentStorage)
            currentState = {...state,...currentTasks}
            localStorage.setItem("tasks",JSON.stringify(currentStorage))
            return currentState
        case REMOVE_TASK:
            // console.log("aboba")
            currentState = {...state}
            currentStorage = {...JSON.parse(localStorage.getItem('tasks')||"{}")}
            delete currentState[action.payload.id]
            delete currentStorage[action.payload.id]
            /* same as edit */
            localStorage.setItem("tasks",JSON.stringify(currentStorage))
            return currentState
        case EDIT_TASK:
            // Object.keys(SITES).forEach(site=>checkoutsBypass[site]={})/* could be out of reducer */
            currentStorage = {...JSON.parse(localStorage.getItem('tasks')||"{}")}
            currentState = {...state, [action.payload.id]:action.payload}
            localStorage.setItem("tasks",JSON.stringify({...currentStorage,[action.payload.id]:{...action.payload,checkoutsBypass,checkouts:{}}}))
            return currentState
        case ADD_CHECKOUT:
            currentState = {...state}
            currentState[action.payload.taskId].checkouts![action.payload.checkoutId] = action.payload.checkout
            return currentState
        case ADD_CHECKOUT_BYPASS:
            currentState = {...state}
            // console.log(action.payload)
            // console.log(currentState[action.payload.taskId])
            !currentState[action.payload.taskId].checkoutsBypass?.[action.payload.url/*  */]?currentState[action.payload.taskId].checkoutsBypass![action.payload.url/*  */]={}:null
            currentState[action.payload.taskId].checkoutsBypass![action.payload.url/*  */][action.payload.checkoutBypassId] = {
                bypass:action.payload.checkoutBypass,
                used:false
            }
            // console.log(currentState)
            return currentState
        case USE_CHECKOUT_BYPASS:
            currentState = {...state}
            !currentState[action.payload.taskId].checkoutsBypass?.[action.payload.url/*  */]?currentState[action.payload.taskId].checkoutsBypass![action.payload.url/*  */]={}:null
            currentState[action.payload.taskId].checkoutsBypass![action.payload.url/*  */][action.payload.checkoutBypassId].used=true
            return currentState
        case RUN_STOP_TASK:
            currentState = {...state}
            if (action.payload.shop == 'shopify'){
                Object.keys(SITES).forEach(site=>!currentState[action.payload.taskId].checkoutsBypass?.[site]?currentState[action.payload.taskId].checkoutsBypass![site]={}:null)/* Create bypass {} for site if null */
                /* Stop bypasses */
                Object.keys(currentState[action.payload.taskId].checkoutsBypass!).map(site=>Object.keys(currentState[action.payload.taskId].checkoutsBypass![site]).map(bypass=>currentState[action.payload.taskId].checkoutsBypass![site][bypass].bypass.setStop=!action.payload.isRun))
            }
            currentState[action.payload.taskId].isRun = action.payload.isRun /* taskIsRun */
            /* Checkouts isRun */
            Object.keys(currentState[action.payload.taskId].checkouts!).map(checkout=>currentState[action.payload.taskId].checkouts![checkout].setStop=!action.payload.isRun)
            /*  */
/*  */
            // Object.keys(currentState[action.payload.taskId].checkoutsBypass).map(site=>Object.keys(currentState[action.payload.taskId].checkoutsBypass[site]).map(bypass=>currentState[action.payload.taskId].checkoutsBypass[site][bypass].bypass?.setStop ? currentState[action.payload.taskId].checkoutsBypass[site][bypass].bypass.setStop=!action.payload.isRun:null))
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
                if (currentState[task].shop=="shopify"){
                    Object.keys(SITES).forEach(site=>!currentState[task].checkoutsBypass?.[site]?currentState[task].checkoutsBypass![site]={}:null)
                    Object.keys(currentState[task].checkoutsBypass!).map(site=>Object.keys(currentState[task].checkoutsBypass![site]).map(bypass=>currentState[task].checkoutsBypass![site][bypass].bypass.setStop=!action.payload.isRun))
                }
                currentState[task].isRun=action.payload.isRun
                Object.keys(currentState[task].checkouts!).map(checkout=>currentState[task].checkouts![checkout].setStop=!action.payload.isRun)
                // Object.keys(currentState[task].checkoutsBypass).map(bypass=>currentState[task].checkoutsBypass[bypass].setStop=!action.payload.isRun)
            })
            return currentState
        default:
            return state
    }
}

