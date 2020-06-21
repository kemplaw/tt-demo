export const ACTION_SET_FROM = 'SET_FROM'
export const ACTION_SET_TO = 'SET_TO'
export const ACTION_SET_IS_CITY_SELECTOR_VISIBLE = 'SET_IS_CITY_SELECTOR_VISIBLE'
export const ACTION_SET_CURRENT_SELECTING_LEFT_CITY = 'SET_CURRENT_SELECTING_LEFT_CITY'
export const ACTION_SET_CITY_DATA = 'SET_CITY_DATA'
export const ACTION_SET_IS_LOADING_CITY_DATA = 'SET_IS_LOADING_CITY_DATA'
export const ACTION_SET_IS_DATE_SELECTOR_VISIBLE = 'SET_IS_DATE_SELECTOR_VISIBLE'
export const ACTION_SET_HIGH_SPEED = 'SET_HIGH_SPEED'

export function setFrom(from) {
  return {
    type: ACTION_SET_FROM,
    payload: from
  }
}

export function setTo(to) {
  return {
    type: ACTION_SET_TO,
    payload: to
  }
}

export function setIsLoadingCityData(isLoadingCityData) {
  return {
    type: ACTION_SET_IS_LOADING_CITY_DATA,
    payload: isLoadingCityData
  }
}

export function setCityData(cityData) {
  return {
    type: ACTION_SET_CITY_DATA,
    payload: cityData
  }
}

export function toggleHighSpeed() {
  return (dispatch, getState) => {
    const { highSpeed } = getState()
    dispatch({
      type: ACTION_SET_HIGH_SPEED,
      payload: !highSpeed
    })
  }
}

export function showCitySelector(currentSelectingLeftCity) {
  return dispatch => {
    dispatch({
      type: ACTION_SET_IS_CITY_SELECTOR_VISIBLE,
      payload: true
    })

    dispatch({
      type: ACTION_SET_CURRENT_SELECTING_LEFT_CITY,
      payload: currentSelectingLeftCity
    })
  }
}

export function hideCitySelector() {
  return {
    type: ACTION_SET_IS_CITY_SELECTOR_VISIBLE,
    payload: false
  }
}

/**
 * @description: 设置选中的城市数据
 */
export function setSelectedCity(city) {
  return (dispatch, getState) => {
    const { currentSelectingLeftCity } = getState()

    if (currentSelectingLeftCity) {
      dispatch(setFrom(city))
    } else {
      dispatch(setTo(city))
    }

    dispatch(hideCitySelector())
  }
}

/**
 * @description: 显示日期选择器
 */
export function showDateSelector() {
  return {
    type: ACTION_SET_IS_DATE_SELECTOR_VISIBLE,
    payload: true
  }
}

/**
 * @description: 隐藏日期选择器
 */
export function hideDateSelector() {
  return {
    type: ACTION_SET_IS_DATE_SELECTOR_VISIBLE,
    payload: false
  }
}

/**
 * @description: 交换始发站与终点站的值
 */
export function exchangeFromTo() {
  return (dispatch, getState) => {
    const { from, to } = getState()
    dispatch(setFrom(to))
    dispatch(setTo(from))
  }
}

/**
 * @description: 获取城市数据
 */
export function fetchCityData() {
  return (dispatch, getState) => {
    const { isLoadingCityData } = getState()

    if (isLoadingCityData) return

    const cache = JSON.parse(localStorage.getItem('city_data_cache') || '{}')

    if (Date.now() < cache.expire) {
      return dispatch(setCityData(cache.data))
    }

    dispatch(setIsLoadingCityData(true))

    fetch('/api/city/getCityData?_=' + Date.now())
      .then(res => res.json())
      .then(({ data: cityData }) => {
        dispatch(setCityData(cityData))
        localStorage.setItem(
          'city_data_cache',
          JSON.stringify({
            data: cityData,
            expire: Date.now() + 60 * 1000
          })
        )
        dispatch(setIsLoadingCityData(false))
      })
      .catch(err => {
        console.log(err)
        dispatch(setCityData({}))
        dispatch(setIsLoadingCityData(false))
      })
  }
}
