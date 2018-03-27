import rest from 'rest';

const loginReducer = (state = { user: '', loginState: 'NOT_LOGGED_IN' }, action) => {
  switch (action.type) {
    case 'LOG_IN':
      return { user: action.username, loginState: 'LOGGED_IN' }
    case 'LOG_OUT':
      return { user: '', loginState: 'NOT_LOGGED_IN' }
    default:
      return state
  }
}

export default loginReducer
