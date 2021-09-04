import React from 'react';
import ReactDOM from 'react-dom';

import 'aos/dist/aos.css';
import './css/bootstrap.min.css';
import './css/index.scss';
import 'whatwg-fetch';
import App from './App';
import { Provider } from 'react-redux';
import {configureStore} from "./store";
import { PersistGate } from 'redux-persist/integration/react'

const storageData = configureStore();

ReactDOM.render(
    <Provider store={storageData.store}>
        <PersistGate loading={null} persistor={storageData.persistor}>
            <App />
        </PersistGate>
    </Provider>, document.getElementById('root'));

