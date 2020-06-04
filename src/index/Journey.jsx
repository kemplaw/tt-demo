import React from 'react'
import switchImg from './imgs/switch.svg'
import './Journey.css'

function Journey({ from, to, exchangeFromTo, showCitySelector }) {
  return (
    <div className='journey'>
      <div className='journey-station' onClick={() => showCitySelector(true)}>
        <input
          value={from}
          className='journey-input journey-from'
          name='from'
          readOnly
          type='text'
        />
      </div>
      <div className='journey-switch' onClick={() => exchangeFromTo()}>
        <img src={switchImg} alt='' />
      </div>
      <div className='journey-station' onClick={() => showCitySelector(false)}>
        <input value={to} className='journey-input journey-to' name='from' readOnly type='text' />
      </div>
    </div>
  )
}

export default Journey
