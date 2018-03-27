const recipient = (state = { etag: 0, number: -1, name: '', email: '', mobile: '', organizationNumber: '' }, action) => {
  switch (action.type) {
    case 'RECIPIENT_FETCH_SUCCEEDED':
      return Object.assign({}, state, action.recipient);
    case 'RECIPIENT_CLEARED':
      return { etag: 0, number: -1, name: '', email: '', mobile: '', organizationNumber: '' }
    case 'RECIPIENT_ATTRIBUTE_CHANGED':
      const newValue1 = { [action.attributeName]: action.value }
      return Object.assign({}, state, newValue1)
    case 'LOG_OUT':
        return { etag: 0, number: -1, name: '', email: '', mobile: '', organizationNumber: '' }
    default:
      return state
  }
}

export default recipient
