import { ActionType } from "."

const ADD_PROFILE = "ADD_PROFILE"
const REMOVE_PROFILE = "REMOVE_PROFILE"
const EDIT_PROFILE = "EDIT_PROFILE"
const defaultState = JSON.parse(localStorage.getItem('profiles')!)||{}
export const profilesReducer = (state = defaultState ,action:ActionType)=>{
    let currentState
    switch (action.type){
        case ADD_PROFILE:
            currentState = {...state,[action.payload.profileName]:action.payload}
            localStorage.setItem("profiles",JSON.stringify(currentState))
            return currentState
        case REMOVE_PROFILE:
            currentState = {...state}
            delete currentState[action.payload.profileName]
            localStorage.setItem("profiles",JSON.stringify(currentState))
            return currentState
        case EDIT_PROFILE:
            currentState = {...state,[action.payload.profileName]:action.payload}
            localStorage.setItem("profiles",JSON.stringify(currentState))
            return currentState
        default:
            return state
    }
}