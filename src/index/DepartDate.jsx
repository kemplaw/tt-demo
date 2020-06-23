import React, { memo, useMemo } from 'react'
import Proptypes from 'prop-types'
import dayjs from 'dayjs'
import './DepartDate.css'
import { h0 } from '../common/fp'

const DepartDate = memo(function DepartDate({ time, onClick }) {
  // 重置时间的时分秒毫秒为 0
  const h0Depart = h0(time)
  const departDate = new Date(h0Depart)
  const departDateString = useMemo(() => dayjs(h0Depart).format('YYYY-MM-DD'), [h0Depart])
  const isTody = h0Depart === h0()
  const weekString = `周 ${['日', '一', '二', '三', '四', '五', '六'][departDate.getDay()]} ${
    isTody ? `（今天）` : ''
  }`

  return (
    <div className='depart-date' onClick={onClick}>
      <input type='hidden' name='date' value={departDateString} />
      {departDateString}
      <span className='depart-week'>{weekString}</span>
    </div>
  )
})

DepartDate.propTypes = {
  time: Proptypes.string.isRequired,
  onClick: Proptypes.func.isRequired
}

export default DepartDate
