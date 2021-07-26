import { combineReducers, createStore } from "redux";
import { profilesReducer } from "./profilesReducer";
import { proxyProfilesReducer } from "./proxyProfilesReducer";
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
    proxy:proxyProfilesReducer
})


export const store = createStore(rootReducer)