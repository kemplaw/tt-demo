import React, { useState, useMemo, useEffect, memo } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import './CitySelector.css'
import ArrowBack from '../Icons/ArrowBack'
import CityList from './CityList'

const CitySelector = memo(function ({
  show,
  cityData,
  fetchCityData,
  isLoading,
  onSelect,
  onBack
}) {
  // 搜索关键词
  const [searchKey, setSearchKey] = useState('')
  const key = useMemo(() => searchKey.trim(), [searchKey])

  useEffect(() => {
    if (!show || cityData || isLoading) return

    fetchCityData()
  }, [show, cityData, fetchCityData, isLoading])

  const outputCitySections = () => {
    if (isLoading) return <div>loading</div>

    if (cityData) {
      return <CityList sections={cityData.cityList} onSelect={onSelect} />
    }

    return <div>error</div>
  }

  return (
    <div
      className={classnames('city-selector', {
        hidden: !show
      })}
    >
      <div className='city-search'>
        <div className='search-back' onClick={() => onBack()}>
          <ArrowBack />
        </div>

        <div className='search-input-wrapper'>
          <input
            type='text'
            value={searchKey}
            className='search-input'
            placeholder='城市、车站的中文或拼音'
            onChange={e => setSearchKey(e.target.value)}
          />
        </div>

        <i
          className={classnames('search-clean', { hidden: key.length === 0 })}
          onClick={() => setSearchKey('')}
        >
          &#xf063;
        </i>
      </div>

      {outputCitySections()}
    </div>
  )
})

CitySelector.propTypes = {
  show: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
  cityData: PropTypes.object,
  onBack: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
  fetchCityData: PropTypes.func.isRequired
}

export default CitySelector
