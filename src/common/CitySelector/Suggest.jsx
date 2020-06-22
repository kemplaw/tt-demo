import React, { memo, useState, useMemo } from 'react'
import PropTypes from 'prop-types'
import { useEffect } from 'react'
import SuggestItem from './SuggestItem'

const Suggest = memo(function ({ searchKey, onSelect }) {
  const [result, setResult] = useState([])

  useEffect(() => {
    fetch(`/api/search?key=${encodeURIComponent(searchKey)}`)
      .then(res => res.json())
      .then(({ result, searchKey: sKey }) => {
        if (sKey === searchKey) {
          setResult(result)
        }
      })
  })

  const fallbackResult = useMemo(() => (result.length ? result : [{ display: searchKey }]), [
    searchKey,
    result
  ])

  return (
    <div className='city-suggest'>
      <ul className='city-suggest-ul'>
        {fallbackResult.map(item => {
          return <SuggestItem key={item.display} name={item.display} onClick={onSelect} />
        })}
      </ul>
    </div>
  )
})

Suggest.propTypes = {
  searchKey: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired
}

export default Suggest
