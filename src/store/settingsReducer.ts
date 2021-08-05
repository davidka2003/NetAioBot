import { ActionType } from "."
import { SettingsInterface } from "../Interfaces/interfaces"

export const EDIT_KEY = "EDIT_KEY"
export const EDIT_SETTINGS = "EDIT_SETTINGS"
const defaultState : SettingsInterface = JSON.parse(localStorage.getItem('settings')!)||{monitorsDelay:5000}
export const settingsReducer = (state = defaultState ,action:ActionType)=>{
    let currentState
    switch (action.type){
        case EDIT_SETTINGS:
            currentState = {...state,...action.payload}
            localStorage.setItem("settings",JSON.stringify(currentState))
            return currentState
        default:
            return state
    }
}