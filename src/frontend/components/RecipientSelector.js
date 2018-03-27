import React from 'react'
import { saveRecipient2 } from '../actions'
import { connect } from 'react-redux'
import style from './components.css'

class RecipientSelector extends React.Component {

  componentDidMount(props) {
    this.props.init()
  }

  render() {
    //console.log(this.props)
    let options = this.props.recipients && this.props.recipients.map(r =>
        <option key={r.number} data-id={r.number}>{r.name}</option>
    );

    return (
      <div className={style.dropdownDiv}>
        <label>Recipient:</label>
        <select onChange={this.props.handleRecipientSelected}>
          {options}
        </select>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
      recipients: state.recipients.recipients
  }
}

const mapDispatchToProps = dispatch => {
  return {
    init: () => dispatch({type: 'RECIPIENTS_FETCH_SUCCEEDED', recipients: []}),
    handleSaveRecipient: recipient => dispatch(saveRecipient2(recipient)),
    handleRecipientSelected: event => dispatch({ type: "LOAD_RECIPIENT_REQUESTED", recipientNumber: findKey(event.target) })
  }
}

const findKey = (target) => {
  for (let node of target.children) {
      if (node.value === target.value) {
        return node.getAttribute('data-id')
      }
  }
}

RecipientSelector = connect(mapStateToProps, mapDispatchToProps)(RecipientSelector)

export default RecipientSelector
