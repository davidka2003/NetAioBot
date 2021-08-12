import { combineReducers, createStore } from "redux";
import { accountsProfilesReducer } from "./accountsProfilesReducer";
import { profilesReducer } from "./profilesReducer";
import { proxyProfilesReducer } from "./proxyProfilesReducer";
import { raffleReducer } from "./raffleReducer";
import { settingsReducer } from "./settingsReducer";
import { tasksReducer } from "./tasksReducer";
export interface ActionType {
    type:string,
    payload:any
}
const rootReducer = combineReducers({
    profiles:profilesReducer,
    tasks:tasksReducer,
    settings:settingsReducer,
    proxy:proxyProfilesReducer,
    accounts:accountsProfilesReducer,
    raffles:raffleReducer
})


export const store = createStore(rootReducer)