## tt-demo（train-ticket）

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

3. 使用 memo 解决 （注意 memo 只适用于函数组件）

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

注意事项：依旧还是与 context 一致，建议在一个组件之中最多只有一个 context

使用例子：

```
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
```

#### Memo & Callback Hook

meme 与 useMemo 的区别：

- memo：该函数针对的是 一个组件的渲染是否重复执行
- useMemo：定义一段函数逻辑 是否重复执行

例子：

```
import React, { useState, useMemo } from 'react'

function Counter({ count }) {
  return (
    <div>
      <button>counter: {count}</button>
    </div>
  )
}

export default function App() {
  const [count, setCount] = useState(0)

  const doubleCount = useMemo(() => {
    return count * 2
  }, [count])

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>click ({count})</button>

      <Counter count={doubleCount} />
    </div>
  )
}

```

#### useCallback

其实就是 useMemo 的简写

`useMemo(() => fn) 相当于 useCallback(fn)`

例子：

```
import React, { useState, useMemo, memo, useCallback } from 'react'

const Counter = memo(function Counter(props) {
  console.log('render counter')

  return (
    <div>
      <button onClick={props.onClick}>counter: {props.count}</button>
    </div>
  )
})

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
  }, [])

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>click ({count})</button>

      <Counter count={doubleCount} onClick={onClick} />
    </div>
  )
}
```

#### Ref Hooks

获取子组件或者 DOM 节点的句柄

例子：

```
const counterRef = useRef()

<Counter ref={counterRef} count={doubleCount} onClick={onClick} />

counterRef.current.speak()

```

渲染周期之间共享数据的存储

例子：

```
const timer = useRef()


useEffect(() => {
  timer.current = setInterval(() => setCount(count => count + 1), 1000)
}, [])

useEffect(() => {
  if (count >= 10) {
    clearInterval(timer.current)
  }
})

```

#### 自定义 Hooks

可以将一段独立的 hooks 逻辑封装到一个 useHooks 函数之中，从而达到复用逻辑的效果

一般使用套路：

1. 封装 hooks 逻辑
2. 返回 jsx

示例代码：

```
import React, { useState, PureComponent, useRef, useEffect, useCallback } from 'react'

// class Counter extends PureComponent {
//   render() {
//     const { count } = this.props

//     return <h1>{count}</h1>
//   }
// }

function useCounter(count) {
  const size = useSize()

  return (
    <h1>
      {count} <div>size: {JSON.stringify(size)}</div>
    </h1>
  )
}

// 自定义 hooks
function useCount(defaultCount = 0) {
  const [count, setCount] = useState(defaultCount)
  const it = useRef()

  useEffect(() => {
    it.current = setInterval(() => setCount(count => count + 1), 1000)
  }, [])

  useEffect(() => {
    if (count >= 10) {
      clearInterval(it.current)
    }
  })

  return [count, setCount]
}

function useSize() {
  const [size, setSize] = useState({
    width: document.documentElement.clientWidth,
    height: document.documentElement.clientHeight
  })

  // 此处使用 useCallback 并给到一个空的依赖列表，避免每次创建新的 onResize 函数
  const onResize = useCallback(() => {
    setSize({
      width: document.documentElement.clientWidth,
      height: document.documentElement.clientHeight
    })
  }, [])

  // 由于依赖了 缓存之后的 onResize 函数， effect 在每个组件之中只会调用一次
  // 如果 onResize 每次都是一个新函数，则 effect 会被调用 多次，这是一种性能损耗
  useEffect(() => {
    console.log('init effect')

    window.addEventListener('resize', onResize, false)

    return () => window.removeEventListener('resize', onResize, false)
  }, [onResize])

  return size
}

export default function App() {
  const [count, setCount] = useCount(1)
  const Counter = useCounter(count)
  const size = useSize()

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>click ({count})</button>
      {Counter}

      <div>size: {JSON.stringify(size)}</div>
    </div>
  )
}

```

#### [Hooks 使用法则](https://react.docschina.org/docs/hooks-rules.html)

只在最顶层使用 Hook：

- 原因：
  - 如果在条件语句或者循环语句中使用 hook ，则会破坏在组件的**不同渲染周期中 hook 的调用数量以及顺序**，进而导致变量错乱等 bug

只在 React 函数中调用 hook

#### [Hooks 的常见问题](https://react.docschina.org/docs/hooks-faq.html)

对传统 React 编程的影响

- 生命周期函数如何映射到 Hooks
  ![生命周期]('/src/assets/images/react_lifycycle.png')

  - shouldComponentUpdate 在函数组件中的实现

  ```
  class Counter extends Component {
    state = {
      hide: false
    }

    shouldComponentUpdate(props, state) {
      if (props.count > 10) {
        return {
          hide: true
        }
      }
    }
  }

  function Counter() {
    const [count, setCount] = useState(0)
    const [hide, setHide] = useState(false)

    if (count > 10) {
      setHide(false)
    }
  }
  ```

  - componentDidMount 以及 componentDidUpdate 的函数组件实现方式：
    `useEffect(...)`
  - 类组件中的错误处理函数，在函数组件中仍无法实现，所以并不能完全取代类组件

- 类实例成员变量如何映射到 Hooks

```
class App {
  it = 0
}

function App() {
  const it = useRef(0)
}
```

- Hooks 中如何获取历史 props 和 state

```
function Counter() {
  const [count, setCount] = useState(0)
  // 使用 useRef 不受函数重渲染影响的特性 保存 count
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
```

- 如何强制更新一个 Hooks 组件

  创建一个不参与实际渲染的 state，然后在需要的时机更新它

### Redux 的概念和意义

状态容器和数据流管理

三大原则：

1. 单一数据源
2. 状态不可变
3. 纯函数修改状态（没有副作用）

#### Reducer

接收当前的数据和 action，返回通过 action 更新之后的数据

#### 异步 Action

详见 `redux-thunk` 的使用文档

#### redux 的使用步骤

- 在 store 中注册 redux

```
createStore(
  combineReducers(reducers),
  initState,
  appMiddleware(thunk)
)
```

- 创建 `actionTypes`

- 创建 `actionCreators` 函数

- 创建 reducers

- 在入口文件中 使用 Provider 包裹入口组件

- 在 主模块之中 使用 connect 包裹主模块组件，形成 HOC

- 子组件中 redux 的使用方法：

  1. 使用 bindActionCreators:
     - 优点：子组件无需知道 redux 的存在，只需要获取 父组件传来的 props
     - 缺点：父组件增加了复杂度
  2. 使用 connect 包裹组件，形成 HOC

     - 优点：无需在父组件之中处理数量繁多的 props
     - 缺点：子组件与 store 形成了耦合，降低了组件的可复用性，同时容易在绑定 state 的时候，出现缺漏，例如：不需要的 state 更新导致组件在不应该被重新渲染的情况下重新渲染，造成了性能上的浪费

### PWA

渐进式网络应用 Progressive Web App

Service Worker 服务工作线程

- 常驻内存运行
- 代理网络请求
- 依赖 HTTPS

Promise

- 优化回调地狱
- async/await

fetch 网络请求

cache API 支持资源的缓存系统

- 缓存资源
- 依赖 service worker 代理网络请求

notification API 消息推送

- 依赖用户授权
- 适合在 service worker 中推送

#### Service Worker

注意以下内容无法访问：

1. DOM 对象
2. 类似 window localstorage 的对象也无法访问

生命周期： fetch 会被多次触发, install 和 activate 都只会被触发一次

- install sw 初次被安装之后
- activate sw 安装并被激活之后
- fetch sw 每次获取数据时

#### cache API

实现 pwa 的离线存储功能

#### Notification API

一般流程：

1. 确定授权情况 `'default' | 'granted' | 'denied' Notification.permission`

- default
- granted 同意授权
- denied 拒绝授权

2. 发起授权请求 `Promise Notification.requestPermission`

3. 使用 Notification 推送消息

- 在 浏览器 上下文中 直接使用 new Notification(...) 推送消息
- 在 Service Worker 中
  - 默认的 权限是 denied
  - 需要先在 浏览器 上下文中获取授权，才能使用
  - 注意推送消息的 api 为
  ```
  Promise self.registration.showNotification(...)
  ```

#### 如何在项目中开启 PWA

- `npm run build` 会自动启用 pwa
- (不推荐在开发环境开启) 直接在 index.js 修改 `serviceWorker.unregister()` 为 `serviceWorker.register()`

### 项目业务选型

采用 MPA 的项目架构，分离不同的逻辑到各自的页面之中，减少项目的维护难度

### Mock 数据

使用 express 搭建简易 mock 服务，具体参考 mock 目录

### 项目任务开发流程梳理：

日常开发项目时，不应该直接从上至下的开发页面，容易产生因为逻辑没有整理清楚而返工的问题

所以应该进行任务拆解

#### 任务拆解

- React 视觉组件拆分
- redux store 状态涉及
- redux action/reducer 涉及

### 遇到的问题：

#### 项目构建时

使用 create-react-app 遇到的问题：

- 创建多页面应用时：遇到 canot xxx filter xxx 的问题

问题出自：

```
new ManifestPlugin({
  fileName: 'asset-manifest.json',
  publicPath: paths.publicUrlOrPath,
  generate: (seed, files, entrypoints) => {
    const manifestFiles = files.reduce((manifest, file) => {
      manifest[file.name] = file.path;
      return manifest;
    }, seed);

    // 此处的 filter 会报错：cannot xxx  filter xxx
    const entrypointFiles = entrypoints.main.filter(
      fileName => !fileName.endsWith('.map')
    );

    return {
      files: manifestFiles,
      entrypoints: entrypointFiles,
    };
  },
}),
```

解决方案：

```
new ManifestPlugin({
  fileName: 'asset-manifest.json',
  publicPath: isEnvProduction ? paths.servedPath : isEnvDevelopment && '/'
})
```

### package 依赖列表

- classnames
- redux
- react-redux
- redux-thunk
- urijs
