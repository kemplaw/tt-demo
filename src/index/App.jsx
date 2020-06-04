import React, { useCallback, useMemo } from 'react'
import { connect } from 'react-redux'
import './App.css'
import Header from '../common/Header'
import Journey from './Journey'
import DepartDate from './DepartDate'
import HighSpeed from './HighSpeed'
import Submit from './Submit'
import { showCitySelector, exchangeFromTo, hideCitySelector } from './actions'
import { bindActionCreators } from 'redux'
import CitySelector from '../common/CitySelector'

function App({ from, to, dispatch, isCitySelectorVisible, cityData, isLoadingCityData }) {
  // 使用 useCallback 避免每次 app 重渲染都会重新生成此函数
  const onBack = useCallback(() => {
    window.history.back()
  }, [])

  const cbs = useMemo(() => {
    console.log('memo init')

    return bindActionCreators(
      {
        exchangeFromTo,
        showCitySelector
      },
      dispatch
    )
  }, [dispatch])

  const citySelectorCbs = useMemo(
    () =>
      bindActionCreators(
        {
          onBack: hideCitySelector
        },
        dispatch
      ),
    [dispatch]
  )

  return (
    <div>
      <div className='header-wrapper'>
        <Header title='火车票' onBack={onBack} />
      </div>
      <form className='form'>
        <Journey from={from} to={to} {...cbs} />
        <DepartDate />
        <HighSpeed />
        <Submit />
      </form>
      <CitySelector
        show={isCitySelectorVisible}
        cityData={cityData}
        isLoading={isLoadingCityData}
        {...citySelectorCbs}
      />
    </div>
  )
}

export default connect(
  function mapStateToProps(state) {
    return state
  },
  function mapDispatchToProps(dispatch) {
    return { dispatch }
  }
)(App)
