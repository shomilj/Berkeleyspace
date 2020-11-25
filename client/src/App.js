import './App.css';
import { Row, Col, Card, Badge, Form } from 'react-bootstrap';
import Select from 'react-select'
import Home from './components/home/home'

import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

const courses = [
  { value: '161', label: 'CS 161' },
  { value: '170', label: 'CS 170' },
  { value: '188', label: 'CS 188' }
]

const professors = [
  { value: 'sahai', label: 'Anant Sahai' },
  { value: 'weaver', label: 'Nicholas Weaver'}
]

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
