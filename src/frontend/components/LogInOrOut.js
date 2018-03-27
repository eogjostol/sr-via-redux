import React from 'react'
import { dispatch } from 'redux'
import { connect } from 'react-redux'
import { logIn, logOut } from '../actions'
import style from './components.css'
import rest from 'rest'

// Uncontrolled component; uses ref instead of value/onChange
class LogInOrOut extends React.Component {

  getFormStyle() {
    return this.props.loginState === 'LOGGED_IN' ? style.logoutTable : style.loginTable;
  }

  getUsernameFieldStyle() {
    return this.props.loginState === 'LOGGED_IN' ? style.loggedInUser : style.loggedOutUser;
  }

  getHeader() {
    return this.props.loginState === 'LOGGED_IN' ? 'Logged in' : 'Not logged in'
  }

  render() {
    let usernameInput
    let passwordInput

    return (
      <div className={style.block}>
      <form
        onSubmit= {
          e => {
            e.preventDefault()
            this.props.submit(usernameInput.value, passwordInput.value, this.props.loginState)
            passwordInput.value = ''
          }
        }
      >
        <table className={this.getFormStyle()}>
          <thead><tr><td>{this.getHeader()}</td></tr></thead>
          <tbody>
            <tr><td>Username:</td><td><input className={this.getUsernameFieldStyle()} disabled={this.props.loginState === 'LOGGED_IN'} ref={node => { usernameInput = node }} /></td></tr>
            <tr hidden={this.props.loginState === 'LOGGED_IN'}><td>Password:</td><td><input type="password" ref={node => { passwordInput = node }} /></td></tr>
          </tbody>
          <tfoot><tr><td><button type="submit">{ this.props.buttonText }</button></td></tr></tfoot>
        </table>
      </form>
      </div>
    )
  }
}

const handleLogin = (username, password) => {
  rest('/login?u=' + username + '&p=' + password)
  .then((response) => {
      if (response.status.code == 200) {
        //alert('Logged in OK')
      } else {
        alert('Wrong username or password')
      }
  });
}

const mapStateToProps = state => {
  return {
    loginState: state.loginReducer.loginState,
    buttonText: state.loginReducer.loginState === 'LOGGED_IN' ? 'Log out' : 'Log in'
  }
}

const mapDispatchToProps = dispatch => {
  return {
    submit: (username, password, loginState) => {
      if (loginState === 'LOGGED_IN')
        dispatch(logOut(username))
      else {
        if (!username.trim()) {
          alert('Please specify username')
          return
        }
        handleLogin(username, password)
        dispatch(logIn(username))
        dispatch({ type: "RECIPIENTS_FETCH_REQUESTED" })
      }
    }
  }
}

LogInOrOut = connect(mapStateToProps, mapDispatchToProps)(LogInOrOut)

export default LogInOrOut
