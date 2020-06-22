import React, { memo } from 'react'
import PropTypes from 'prop-types'

const SuggestItem = memo(function ({ name, onClick }) {
  return (
    <li className='city-suggest-li' onClick={() => onClick(name)}>
      {name}
    </li>
  )
})

SuggestItem.propTypes = {
  name: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired
}

export default SuggestItem
