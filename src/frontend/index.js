'use strict';

import React from 'react'
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux'
import {applyMiddleware, createStore} from 'redux'
import createSagaMiddleware from 'redux-saga'
import srApp from './reducers'
import App from './components/App'
import mySaga from './sagas'

const sagaMiddleware = createSagaMiddleware()
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const enhancer = composeEnhancers(
    applyMiddleware(sagaMiddleware),
    // other store enhancers if any
);

const store = createStore(
    srApp,
    enhancer
);

sagaMiddleware.run(mySaga)

ReactDOM.render(
    <Provider store={store}>
        <App/>
    </Provider>,
    document.getElementById('root')
)
