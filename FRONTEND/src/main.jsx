import './index.css'
import App from './App.jsx'

import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";
import { Provider } from 'react-redux';
import store from './app/store.js';

createRoot(document.getElementById('root')).render(

  <BrowserRouter>

    {/* provide redux store to the app */}
    <Provider store={store}>

      <App />

    </Provider>

  </BrowserRouter>

);
