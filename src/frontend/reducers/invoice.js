const invoice = (state = { accountNumber: '', amount: 0, currency: 'NOK', text: '', dueDate: '2001-01-01', issueDate: '2001-01-01' }, action) => {
  switch (action.type) {
    case 'INVOICE_FETCH_SUCCEEDED':
      return { accountNumber: action.invoice.accountNumber, amount: action.invoice.total, currency: action.invoice.currency, text: action.invoice.text,
        dueDate: '2017-07-28', issueDate: '2017-07-26' }
    case 'INV_ATTR_CHANGED':
      var newValue = { [action.name]: action.value };
      return Object.assign({}, state, newValue);
    case 'CURRENCY_SELECTED':
      var newCurrency = { currency: action.currency };
      return Object.assign({}, state, newCurrency);
      //return { currency: action.currency, text: state.text, dueDate: state.dueDate, issueDate: state.issueDate }
    case 'LOG_OUT':
      return { accountNumber: '', amount: 0, currency: '', text: '', dueDate: '2001-01-01', issueDate: '2001-01-01' }
    default:
      return state
  }
}

export default invoice
