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
