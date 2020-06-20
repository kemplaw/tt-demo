import React, { useState, useMemo, useEffect } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import './CitySelector.css'
import ArrowBack from './Icons/ArrowBack'

function CitySelector({ show, cityData, fetchCityData, isLoading, onBack }) {
  // 搜索关键词
  const [searchKey, setSearchKey] = useState('')
  const key = useMemo(() => searchKey.trim(), [searchKey])

  useEffect(() => {
    if (!show || cityData || isLoading) return

    fetchCityData()
  }, [show, cityData, fetchCityData, isLoading])

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
    </div>
  )
}

CitySelector.propTypes = {
  show: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
  cityData: PropTypes.object,
  onBack: PropTypes.func.isRequired,
  fetchCityData: PropTypes.func.isRequired
}

export default CitySelector
