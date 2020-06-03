let id_seq = Date.now()

export function createSet(payload) {
  return {
    type: 'set',
    payload
  }
}

export function createAdd(text) {
  // 去重逻辑处理
  return (dispatch, getState) => {
    setTimeout(() => {
      const { todos } = getState()

      if (!todos.find(todo => todo.text === text)) {
        dispatch({
          type: 'add',
          payload: {
            id: id_seq++,
            text,
            completed: false
          }
        })
      }
    }, 3000)
  }
}

export function createRemove(payload) {
  return {
    type: 'remove',
    payload
  }
}

export function createToggle(payload) {
  return {
    type: 'toggle',
    payload
  }
}
