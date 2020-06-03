import React, { useState, useCallback, useRef, useEffect, memo } from 'react'
import { createToggle, createRemove, createAdd, createSet } from './actions'
import { reducer } from './reducers'

let idSeq = Date.now()
const LS_KEY = 'todos'

function bindActionCreators(actionCreators, dispatch) {
  const ret = {}

  for (const key in actionCreators) {
    ret[key] = function (...args) {
      const actionCreator = actionCreators[key]
      const action = actionCreator(...args)
      dispatch(action)
    }
  }

  return ret
}

const Control = memo(function (props) {
  const { addTodo } = props
  const inputRef = useRef()

  const onSubmit = e => {
    e.preventDefault()
    const input = inputRef.current.value.trim()

    if (input.length === 0) return

    const newTodo = { id: idSeq++, text: input, complete: false }
    addTodo(newTodo)
    inputRef.current.value = ''
  }

  return (
    <div className='control'>
      <h1>todos</h1>
      <form onSubmit={onSubmit}>
        <input
          type='text'
          ref={inputRef}
          className='new-todo'
          placeholder='what needs to be done'
        />
      </form>
    </div>
  )
})

const TodoItem = memo(function (props) {
  const { todo, removeTodo, toggleTodo } = props
  const { id, text, complete } = todo
  const onChange = () => {
    toggleTodo(id)
  }
  const onRemove = e => {
    e.stopPropagation()
    removeTodo(id)
  }

  return (
    <li className='todo-item' onClick={onChange}>
      <input readOnly checked={complete} type='checkbox' />
      <label className={complete ? 'completed' : ''}>{text}</label>
      <button className='button' type='button' onClick={onRemove}>
        &#xd7;
      </button>
    </li>
  )
})

const Todos = memo(function (props) {
  const { todos, removeTodo, toggleTodo } = props
  return (
    <div>
      <ul>
        {todos.map(todo => (
          <TodoItem key={todo.id} todo={todo} removeTodo={removeTodo} toggleTodo={toggleTodo} />
        ))}
      </ul>
    </div>
  )
})

function TodoList() {
  const [todos, setTodos] = useState([])
  const [incrementCount, setIncrementCount] = useState(0)

  // 使用 useCallback 缓存函数 避免每次重新生成该函数
  const dispatch = useCallback(
    action => {
      const state = {
        todos,
        incrementCount
      }
      const setters = {
        todos: setTodos,
        incrementCount: setIncrementCount
      }

      const newState = reducer(state, action)

      for (const key in newState) {
        setters[key](newState[key])
      }
    },
    [todos, incrementCount]
  )

  useEffect(() => {
    const todosFromStorage = JSON.parse(localStorage.getItem(LS_KEY)) || []
    dispatch(createSet(todosFromStorage))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(todos))
  }, [todos])

  return (
    <div className='todo-list'>
      <Control
        {...bindActionCreators(
          {
            addTodo: createAdd
          },
          dispatch
        )}
      />
      <Todos
        todos={todos}
        {...bindActionCreators(
          {
            removeTodo: createRemove,
            toggleTodo: createToggle
          },
          dispatch
        )}
      />
    </div>
  )
}

export default TodoList
