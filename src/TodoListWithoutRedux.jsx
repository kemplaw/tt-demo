import React, { useState, useCallback, useRef, useEffect, memo } from 'react'

let idSeq = 1
const LS_KEY = 'todos'

const Control = memo(function (props) {
  const { addTodo } = props
  const inputRef = useRef()

  const onSubmit = e => {
    e.preventDefault()
    const input = inputRef.current.value.trim()

    if (input.length === 0) return

    addTodo({ id: idSeq++, text: input, complete: false })
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
  const onRemove = () => {
    removeTodo(id)
  }

  return (
    <li className='todo-item' onClick={onChange}>
      <input readOnly checked={complete} type='checkbox' />
      <label className={complete ? 'completed' : ''}>{text}</label>
      <button type='button' onClick={onRemove}>
        &#xd7;
      </button>
    </li>
  )
})

const Todos = memo(function (props) {
  const { todos, toggleTodo, removeTodo } = props
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

export default memo(function () {
  const [todos, setTodos] = useState([])
  const addTodo = useCallback(todo => {
    setTodos(todos => [...todos, todo])
  }, [])
  const removeTodo = useCallback(id => {
    setTodos(todos => todos.filter(todo => todo.id !== id))
  }, [])
  const toggleTodo = useCallback(id => {
    setTodos(todos =>
      todos.map(todo => (todo.id === id ? { ...todo, complete: !todo.complete } : todo))
    )
  }, [])

  useEffect(() => {
    const todosFromStorage = JSON.parse(localStorage.getItem(LS_KEY)) || []
    setTodos(todosFromStorage)
  }, [])

  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(todos))
  }, [todos])

  return (
    <div className='todo-list'>
      <Control addTodo={addTodo} />
      <Todos todos={todos} removeTodo={removeTodo} toggleTodo={toggleTodo} />
    </div>
  )
})
