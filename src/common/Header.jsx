import React from 'react'
import PropTypes from 'prop-types'
import './Header.css'
import ArrowBack from './Icons/ArrowBack'

function Header({ onBack, title }) {
  return (
    <div className='header'>
      <div className='header-back' onClick={onBack}>
        <ArrowBack />
      </div>

      <h1 className='header-title'>{title}</h1>
    </div>
  )
}

Header.propTypes = {
  onBack: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired
}

export default Header
