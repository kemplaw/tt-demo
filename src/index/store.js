import reducers from './reducers'
import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'

const defaultState = {
  from: '北京',
  to: '上海',
  isCitySelectorVisible: false,
  currentSelectingLeftCity: false,
  // 城市数据
  cityData: null,
  // 当前是否加载城市数据
  isLoadingCityData: false,
  isDateSelectorVisible: false,
  // 是否为高铁
  highSpeed: false
}

export default createStore(combineReducers(reducers), defaultState, applyMiddleware(thunk))
