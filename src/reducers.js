export function combineReducers(reducers) {
  return function reducer(state, action) {
    const changed = {}

    for (const key in reducers) {
      changed[key] = reducers[key](state[key], action)
    }

    return {
      ...state,
      ...changed
    }
  }
}

export const reducers = {
  todos(state, action) {
    const { type, payload } = action

    switch (type) {
      case 'set':
        return payload
      case 'add':
        return [...state, payload]
      case 'remove':
        return state.filter(todo => todo.id !== payload)
      case 'toggle':
        return state.map(todo =>
          todo.id === payload ? { ...todo, complete: !todo.complete } : todo
        )
      default:
        return state
    }
  },
  incrementCount(state, action) {
    const { type, payload } = action

    switch (type) {
      case 'set':
      case 'add':
        return payload + 1
      default:
        return state
    }
  }
}

export const reducer = combineReducers(reducers)
