## tt-demo

React Hooks demo 项目

#### Context

定义：

- Context 提供一种方式在组件树中传递 而非一级一级的传递

结构：

- Context：context 的实例对象
- Provider：context 生产者 - 携带变量值
- Consumer：context 消费者 - 接收变量值

实例 1：

```
import React, { createContext, Component } from 'react'
import './App.css'

// 创建 context
const BatteryContext = createContext()

function Leaf() {
  return <BatteryContext.Consumer>{battery => <h1>battery: {battery}</h1>}</BatteryContext.Consumer>
}

// 中间组件 middle
function Middle() {
  return <Leaf />
}

class App extends Component {
  state = {
    battery: 60
  }

  render() {
    const { battery } = this.state

    return (
      <BatteryContext.Provider value={battery}>
        <button
          type='button'
          onClick={() =>
            this.setState({
              battery: battery - 1
            })
          }
        >
          点击
        </button>
        <Middle />
      </BatteryContext.Provider>
    )
  }
}

export default App
```

实例 2：实现多个 context 的使用

```
import React, { createContext, Component } from 'react'
import './App.css'

// 创建 context
const BatteryContext = createContext()
const OnlineContext = createContext()

function Leaf() {
  return (
    <BatteryContext.Consumer>
      {battery => (
        <OnlineContext.Consumer>
          {online => (
            <h1>
              battery: {battery}, online: {online.toString()}
            </h1>
          )}
        </OnlineContext.Consumer>
      )}
    </BatteryContext.Consumer>
  )
}

// 中间组件 middle
function Middle() {
  return <Leaf />
}

class App extends Component {
  state = {
    online: false,
    battery: 60
  }

  render() {
    const { battery, online } = this.state

    return (
      <BatteryContext.Provider value={battery}>
        <OnlineContext.Provider value={online}>
          <button
            onClick={() =>
              this.setState({
                online: !online
              })
            }
          >
            切换online
          </button>
          <button
            type='button'
            onClick={() =>
              this.setState({
                battery: battery - 1
              })
            }
          >
            点击
          </button>
          <Middle />
        </OnlineContext.Provider>
      </BatteryContext.Provider>
    )
  }
}

export default App

```
