import React, {
  useState,
  useMemo,
  memo,
  useCallback,
  useRef,
  PureComponent,
  useEffect
} from 'react'

// const Counter = memo(function Counter(props) {
//   console.log('render counter')

//   return (
//     <div>
//       <button onClick={props.onClick}>counter: {props.count}</button>
//     </div>
//   )
// })

class Counter extends PureComponent {
  speak() {
    console.log(`new cuonter: ${this.props.count}`)
  }

  render() {
    const { onClick, count } = this.props

    return <h1 onClick={onClick}>{count}</h1>
  }
}

// function Counter(props) {
//   console.log('render counter')

//   return (
//     <div>
//       <button>counter: {props.count}</button>
//     </div>
//   )
// }

export default function App() {
  const [count, setCount] = useState(0)
  const [clickCount, setClickCount] = useState(0)
  const counterRef = useRef()
  const timer = useRef()

  const doubleCount = useMemo(() => {
    return count * 2
  }, [count === 3])

  // 会导致 counter 组件重新渲染
  // const onClick = () => {
  //   console.log('click')
  // }

  // 解决方案1：useMemo
  // const onClick = useMemo(
  //   () => () => {
  //     console.log('click')
  //   },
  //   []
  // )

  // 解决方案2：useCallback
  const onClick = useCallback(() => {
    console.log('click')
    setClickCount(clickCount => clickCount + 1)
    console.log(counterRef.current.speak())
  }, [counterRef])

  useEffect(() => {
    timer.current = setInterval(() => setCount(count => count + 1), 1000)
  }, [])

  useEffect(() => {
    if (count >= 10) {
      clearInterval(timer.current)
    }
  })

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>click ({count})</button>

      <Counter ref={counterRef} count={doubleCount} onClick={onClick} />
    </div>
  )
}
