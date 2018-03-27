const postalAddress = (state = { line1: '', line2: '', postCode: '', city: '', country: '' }, action) => {
  switch (action.type) {
    case 'COUNTRY_SELECTED':
      return Object.assign({}, state, { country: action.country })
    case 'LOG_OUT':
        return { line1: '', line2: '', postCode: '', city: '', country: '' }
    case 'POSTAL_ADDRESS_ATTRIBUTE_CHANGED':
      const newValue = { [action.attributeName]: action.value }
      return Object.assign({}, state, newValue)
    case 'RECIPIENT_ADDRESS_FETCH_SUCCEEDED':
      return Object.assign({}, state, action.postalAddress);
    case 'RECIPIENT_CLEARED':
      return { line1: '', line2: '', postCode: '', city: '', country: '' }
    default:
      return state
  }
}

export default postalAddress
