import React, { memo } from 'react'
import PropTypes from 'prop-types'
import CitySelection from './CitySelection'

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

export default CityList
