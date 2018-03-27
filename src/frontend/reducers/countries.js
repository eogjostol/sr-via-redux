const countries = (state = [], action) => {
  switch (action.type) {
    case 'COUNTRIES_FETCH_SUCCEEDED':
      return { countries: action.countries }
    default:
      return state
  }
}

export default countries
