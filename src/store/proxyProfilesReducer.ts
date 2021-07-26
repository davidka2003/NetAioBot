import { ActionType } from "."

export const ADD_PROXY_PROFILE = "ADD_PROXIE_PROFILE"
export const REMOVE_PROXY_PROFILE = "REMOVE_PROXIE_PROFILE"
export const EDIT_PROXY_PROFILE = "EDIT_PROXIE_PROFILE"
const defaultState = JSON.parse(localStorage.getItem('proxyProfiles')!)||{}
export const proxyProfilesReducer = (state = defaultState ,action:ActionType)=>{
    let currentState
    switch (action.type){
        case ADD_PROXY_PROFILE:
            currentState = {...state,[action.payload.profileName]:action.payload}
            localStorage.setItem("proxyProfiles",JSON.stringify(currentState))
            return currentState
        case REMOVE_PROXY_PROFILE:
            currentState = {...state}
            delete currentState[action.payload.profileName]
            localStorage.setItem("proxyProfiles",JSON.stringify(currentState))
            return currentState
        case EDIT_PROXY_PROFILE:
            currentState = {...state,[action.payload.profileName]:action.payload}
            localStorage.setItem("proxyProfiles",JSON.stringify(currentState))
            return currentState
        default:
            return state
    }
}