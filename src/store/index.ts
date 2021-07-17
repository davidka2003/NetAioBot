import { combineReducers, createStore } from "redux";
import { profilesReducer } from "./profilesReducer";
import { tasksReducer } from "./tasksReducer";
export interface ActionType {
    type:string,
    payload:any
}
const rootReducer = combineReducers({
    profiles:profilesReducer,
    tasks:tasksReducer
})


export const store = createStore(rootReducer)