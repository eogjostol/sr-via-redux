import React from 'react'
import Invoice from '../components/Invoice'
import LogInOrOut from '../components/LogInOrOut'
import Recipient from '../components/Recipient'
import RecipientSelector from '../components/RecipientSelector'
import style from './components.css'

const App = (props) => (
  <div className={style.gridContainer}>
    <div className={style.login}>
      <LogInOrOut />
    </div>
    <div className={style.recipient}>
      <RecipientSelector />
      <Recipient />
    </div>
    <div className={style.invoice}>
      <Invoice />
    </div>
  </div>
)
 
export default App
