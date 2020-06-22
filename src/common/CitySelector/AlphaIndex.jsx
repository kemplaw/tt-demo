import React, { memo } from 'react'
import PropTypes from 'prop-types'

const AlphaIndex = memo(function ({ alpha, onClick }) {
  return (
    <i className='city-index-item' onClick={() => onClick(alpha)}>
      {alpha}
    </i>
  )
})

AlphaIndex.propTypes = {
  alpha: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired
}

export default AlphaIndex
