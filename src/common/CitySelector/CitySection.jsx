import React, { memo } from 'react'
import PropTypes from 'prop-types'
import CityItem from './CityItem'

const CitySection = memo(function ({ title, cities = [], onSelect }) {
  return (
    <ul className='city-ul'>
      <li className='city-li' key='title' data-cate={title}>
        {title}
      </li>
      {cities.map(({ name }) => (
        <CityItem key={name} name={name} onSelect={onSelect} />
      ))}
    </ul>
  )
})

CitySection.propTypes = {
  title: PropTypes.string.isRequired,
  cities: PropTypes.array,
  onSelect: PropTypes.func.isRequired
}

export default CitySection
