import reducers from './reducers'
import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'

export default createStore(combineReducers(reducers), {}, applyMiddleware(thunk))
