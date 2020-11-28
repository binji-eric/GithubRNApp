import {applyMiddle, applyMiddleware, createStore} from 'redux'
import thunk from 'redux-thunk'
import reducers from '../reducer/index'

const middlewares = [
    thunk
];
/**
 *  2，创建store
 */
export default createStore(reducers, applyMiddleware(...middlewares));