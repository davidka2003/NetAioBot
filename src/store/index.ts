import { combineReducers, createStore } from "redux";
import { profilesReducer } from "./profilesReducer";
import { settingsReducer } from "./settingsReducer";
import { tasksReducer } from "./tasksReducer";
export interface ActionType {
    type:string,
    payload:any
}
const rootReducer = combineReducers({
    profiles:profilesReducer,
    tasks:tasksReducer,
    settings:settingsReducer
})


export const store = createStore(rootReducer)