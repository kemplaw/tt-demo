import React, { useState, PureComponent, useRef, useEffect, useCallback } from 'react'

// class Counter extends PureComponent {
//   render() {
//     const { count } = this.props

//     return <h1>{count}</h1>
//   }
// }

// function useCounter(count) {
//   const size = useSize()

//   return (
//     <h1>
//       {count} <div>size: {JSON.stringify(size)}</div>
//     </h1>
//   )
// }

// // 自定义 hooks
// function useCount(defaultCount = 0) {
//   const [count, setCount] = useState(defaultCount)
//   const it = useRef()

//   useEffect(() => {
//     it.current = setInterval(() => setCount(count => count + 1), 1000)
//   }, [])

//   useEffect(() => {
//     if (count >= 10) {
//       clearInterval(it.current)
//     }
//   })

//   return [count, setCount]
// }

// function useSize() {
//   const [size, setSize] = useState({
//     width: document.documentElement.clientWidth,
//     height: document.documentElement.clientHeight
//   })

//   // 此处使用 useCallback 并给到一个空的依赖列表，避免每次创建新的 onResize 函数
//   const onResize = useCallback(() => {
//     setSize({
//       width: document.documentElement.clientWidth,
//       height: document.documentElement.clientHeight
//     })
//   }, [])

//   // 由于依赖了 缓存之后的 onResize 函数， effect 在每个组件之中只会调用一次
//   // 如果 onResize 每次都是一个新函数，则 effect 会被调用 多次，这是一种性能损耗
//   useEffect(() => {
//     console.log('init effect')

//     window.addEventListener('resize', onResize, false)

//     return () => window.removeEventListener('resize', onResize, false)
//   }, [onResize])

//   return size
// }

// export default function App() {
//   const [count, setCount] = useCount(1)
//   const Counter = useCounter(count)
//   const size = useSize()

//   return (
//     <div>
//       <button onClick={() => setCount(count + 1)}>click ({count})</button>
//       {Counter}

//       <div>size: {JSON.stringify(size)}</div>
//     </div>
//   )
// }

function Counter() {
  const [count, setCount] = useState(0)
  const prevCountRef = useRef()

  useEffect(() => {
    prevCountRef.current = count
    console.log('effected')
  })

  const prevCount = prevCountRef.current

  console.log('get prevCount')

  return (
    <div>
      <button onClick={() => setCount(count => count + 1)}>
        counter: {count}, before: {prevCount}
      </button>
    </div>
  )
}

export default function App() {
  return (
    <div>
      <Counter />
    </div>
  )
}
