import React from 'react';
import './index.css';
import './App.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.css';

import { render } from 'react-dom'
import { Provider } from 'react-redux'

import store from './redux/store'
import ReactGA from 'react-ga';

/* Initialize Google Analytics. */
ReactGA.initialize('G-ZMDNDHM5EN');

const renderApp = () => {
  render (
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById('root')
  )
}

if (process.env.NODE_ENV !== 'production' && module.hot) {
  module.hot.accept('./App', renderApp)
}

renderApp()

reportWebVitals();
