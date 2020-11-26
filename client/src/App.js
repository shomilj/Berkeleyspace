import './App.css';
import Home from './components/home/home'

import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";


function App() {
  return (
    <Router>
      <div>
        <Switch>
          <Route path="/"> <Home /> </Route>
        </Switch>
      </div>
    </Router>
  );
}


export default App;
