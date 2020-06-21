import React, { memo } from 'react'
import PropTypes from 'prop-types'

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

export default CityItem
