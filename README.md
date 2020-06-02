## tt-demo

React Hooks demo 项目

#### 编程效率

- context
- contextType

#### 程序性能

- lazy
- Suspense

### Context

定义：

- Context 提供一种方式在组件树中传递 而非一级一级的传递

注意事项：

- context 会让组件的独立性变差，不宜大规模的使用
- 一般一个组件之中，最多建议一个 context

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

#### contextType

直接获取 context 的值，无需通过 Consumer 包裹的回调函数获取

实例：

```
class MyClass extends React.Component {
  static contextType = MyContext;
  render() {
    let value = this.context;
    /* 基于这个值进行渲染工作 */
  }
}
```

#### lazy

背景: 应用中暂时没有使用的资源，需要延迟加载

途径：

- Webpack - Code Spliting
- import - 动态导入模块 `import('module').then(...)`

实例：

```
import React, { Component, lazy, Suspense } from 'react'

const About = lazy(() => import('./About'))

class App extends Component {
  render() {
    return (
      <div>
        <Suspense fallback={() => <div>loading</div>}>
          <About />
        </Suspense>
      </div>
    )
  }
}

export default App

```

#### Suspense

React 16.6 新增了 <Suspense> 组件，让你可以“等待”目标代码加载，并且可以直接指定一个加载的界面（像是个 spinner），让它在用户等待的时候显示：

### ErrorBoundary 错误边界处理

```
import React, { Component, lazy, Suspense } from 'react'

const About = lazy(() => import(/* webpackChunkName: "about-view" */ './About'))

// ErrorBoundary - 处理错误组件
// componentDidPatch

class App extends Component {
  state = {
    hasError: false
  }

  // 写法一
  static getDerivedStateFromError() {
    debugger
    return {
      hasError: true
    }
  }

  // 或者

  // 写法二
  componentDidCatch() {
    this.setState({
      hasError: true
    })
  }

  render() {
    if (this.state.hasError) return <div>error</div>

    return (
      <div>
        <Suspense fallback={<div>loading</div>}>
          <About />
        </Suspense>
      </div>
    )
  }
}

export default App
```

#### memo

需要解决的问题例子：

Foo 组件未引用任何数据，并不需要渲染
App 组件在更新自身状态的同时，重新渲染，结果，也将 Foo 组件重新渲染了
这是一种不必要的开销

```
import React, { Component } from 'react'

class Foo extends Component {
  render() {
    console.log('render foo')

    return null
  }
}

export default class App extends Component {
  state = {
    count: 0
  }

  render() {
    const { count } = this.state

    return (
      <div>
        <button onClick={() => this.setState({ count: count + 1 })}>click</button>
        <Foo name='mike' />
      </div>
    )
  }
}
```

解决方案：

1. 使用 shouldComponentUpdate 解决

```
shouldComponentUpdate(props, state) {
  if (props.name === this.props.name) return false

  return true
}
```

2. 使用 PureComponent 解决

```
class Foo extends PureComponent {
  render() {
    console.log('render foo')

    return null
  }
}
```

- 注意事项：只有 props 的第一级数据发生变化，才会触发渲染

- 例如以下的情况是不会触发 Foo 的视图更新的

```
import React, { Component, PureComponent } from 'react'

class Foo extends PureComponent {
  render() {
    console.log('render foo')

    return <div>{this.props.person.age}</div>
  }
}

export default class App extends Component {
  state = {
    count: 0,
    person: {
      age: 1
    }
  }

  render() {
    const { count, person } = this.state

    return (
      <div>
        <button
          onClick={() => {
            person.age++

            this.setState({
              person
            })
          }}
        >
          修改 person
        </button>

        <button
          onClick={() =>
            this.setState({
              count: count + 1
            })
          }
        >
          click
        </button>
        <Foo name='mike' person={person} />
      </div>
    )
  }
}

```

3. 使用 memo 解决

```
const MemoFoo = memo(function Foo(props) {
  console.log('render foo')

  return <div>{props.person.age}</div>
})
```

### React Hook

概念：Hook 允许在函数组件中使用状态

类组件不足：

- 状态逻辑复用难
  - 缺少复用机制
  - 渲染属性和高阶组件导致层级冗余
- 趋向复杂难以维护
  - 生命周期函数混杂不相干逻辑
  - 相干组件逻辑散步在不同生命周期函数
- this 指向困扰：
  - 内敛函数过度创建新句柄
  - 类成员函数不能保证 this

hooks 优势

- 优化类组件的三大问题
  - 无 this 问题
  - 自定义 Hook 方便复用状态逻辑
  - 副作用的关注点分离

#### State Hook

注意事项：

- useState 必须按照 固定的顺序 和 数量 来调用
- useState 的调用次数必须每次都相同，所以不建议在条件语句或者循环中调用
- useState 可以传入一个函数，来延迟初始化，提高效率

例子对比：

使用 传统 class 实现一个计数器

```
import React, { Component } from 'react'

class App extends Component {
  state = {
    count: 0
  }
  render() {
    const { count } = this.state
    return (
      <>
        <button onClick={() => this.setState({ count: count + 1 })}>click</button>
        <div>count: {count}</div>
      </>
    )
  }
}

export default App

```

使用 hook 实现一个计数器

```
import React from 'react'
import { useState } from 'react'

export default function App() {
  const [count, setCount] = useState(0)

  return <button onClick={() => setCount(count + 1)}>click {count}</button>
}
```

#### Effect Hook

副作用时机：

- Mount 之后
- Update 之后
- Unmount 之前

依赖列表

useEffect 的第二个参数，可以指定传入的变量发生变化时再运行副作用


#### Context Hook

