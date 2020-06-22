import React, { memo } from 'react'
import PropTypes from 'prop-types'
import CitySelection from './CitySection'
import AlphaIndex from './AlphaIndex'

const alphabet = Array.from(new Array(26), (v, i) => {
  return String.fromCharCode(65 + i)
})

const CityList = memo(function ({ sections, onSelect, toAlpha }) {
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
      <div className='city-index'>
        {alphabet.map(v => (
          <AlphaIndex key={v} alpha={v} onClick={toAlpha} />
        ))}
      </div>
    </div>
  )
})

CityList.propTypes = {
  sections: PropTypes.array.isRequired,
  onSelect: PropTypes.func.isRequired,
  toAlpha: PropTypes.func.isRequired
}

export default CityList
