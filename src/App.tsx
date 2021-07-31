import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react'
import NavPills from './Components/Navigation/NavPills'
import Tasks from './Components/Tasks/Tasks'
import AddTask from './Components/AddTask/AddTask'
import Profiles from './Components/Profiles/Profiles'
import Proxy from './Components/Proxy/Proxy'
import Calendar from './Components/Calendar/Calendar'
import Settings from './Components/Settings/Settings'
import { Provider } from 'react-redux'
import { store } from './store'

let App = ()=>{
    return (
    <Provider store={store}>
        <div id="App" className="d-flex align-items-start">
            {/* <div className="area" >
              <ul className="circles">
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
              </ul>
            </div > */}
            <NavPills/>
            <div className="tab-content col-10" id="v-pills-tabContent">
                <Tasks/>
                <AddTask/>
                <Profiles/>
                <Proxy/>
                <Calendar/>
                <Settings/>
            </div>
        </div>
    </Provider>)
    }

export default App
// ReactDOM.render(<App/>,document.querySelector('#root'))
