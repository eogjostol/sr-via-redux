const currencies = (state = [{code: "kr", name: "kroner", rate: 1}], action) => {
  switch (action.type) {
    case 'CURRENCIES_FETCH_SUCCEEDED':
      return { currencies: action.currencies }
    default:
      return state
  }
}

export default currencies
