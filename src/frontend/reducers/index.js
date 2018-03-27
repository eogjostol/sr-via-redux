import { combineReducers } from 'redux'
import countries from './countries'
import currencies from './currencies'
import invoice from './invoice'
import loginReducer from './loginReducer'
import recipient from './recipient'
import recipients from './recipients'
import postalAddress from './postalAddress'

const srApp = combineReducers({
  loginReducer,
  countries,
  currencies,
  recipient,
  recipients,
  postalAddress,
  invoice
})

export default srApp