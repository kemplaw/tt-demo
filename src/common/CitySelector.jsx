import React, { useState, useMemo, useEffect, memo } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import './CitySelector.css'
import ArrowBack from './Icons/ArrowBack'

const CityItem = memo(function ({ name, onSelect }) {
  return (
    <li className='city-li' onClick={() => onSelect(name)}>
      {name}
    </li>
  )
})

CityItem.propTypes = {
  name: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired
}

const CitySelection = memo(function ({ title, cities = [], onSelect }) {
  return (
    <ul className='city-ul'>
      <li className='city-li' key='title'>
        {title}
      </li>
      {cities.map(({ name }) => (
        <CityItem key={name} name={name} onSelect={onSelect} />
      ))}
    </ul>
  )
})

CitySelection.propTypes = {
  title: PropTypes.string.isRequired,
  cities: PropTypes.array,
  onSelect: PropTypes.func.isRequired
}

const CityList = memo(function ({ sections, onSelect }) {
  return (
    <div className='city-list'>
      <div className='city-cate'>
        {sections.map(section => (
          <CitySelection
            key={section.title}
            title={section.title}
            cities={section.citys}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  )
})

CityList.propTypes = {
  sections: PropTypes.array.isRequired,
  onSelect: PropTypes.func.isRequired
}

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
