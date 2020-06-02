import React, { useContext, useState, Component, createContext } from 'react'

const CountContext = createContext()

class Foo extends Component {
  render() {
    return <CountContext.Consumer>{count => <h1>{count}</h1>}</CountContext.Consumer>
  }
}

class Bar extends Component {
  static contextType = CountContext

  render() {
    return <div>{this.context}</div>
  }
}

function Counter() {
  const count = useContext(CountContext)

  return <div>count: {count}</div>
}

export default function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>click {count}</button>
      <CountContext.Provider value={count}>
        <Foo />
        <hr />
        <Bar />
        <hr />
        <Counter />
      </CountContext.Provider>
    </div>
  )
}
