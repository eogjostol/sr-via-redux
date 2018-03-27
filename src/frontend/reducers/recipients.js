const recipients = (state = { recipients: [], anySelected: false }, action) => {
  const defaultOptions = [{number: -1, name: "<New>"}]

  switch (action.type) {
    case 'RECIPIENT_CLEARED':
      return Object.assign({}, state, { anySelected: false })
    case 'RECIPIENT_FETCH_SUCCEEDED':
      return Object.assign({}, state, { anySelected: true })
    case 'RECIPIENTS_FETCH_SUCCEEDED':
      return { recipients: defaultOptions.concat(action.recipients), anySelected: false }
    case 'LOG_OUT':
        return { recipients: defaultOptions, anySelected: false }
    default:
      return state
  }
}

export default recipients
