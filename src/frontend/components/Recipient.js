import React from 'react'
import { saveRecipient2 } from '../actions'
import { connect } from 'react-redux'
import style from './components.css'

class RecipientAttribute extends React.Component {
  render() {
    return (
      <tr>
        <td>{this.props.label}:</td>
        <td><input value={this.props.value} onChange={this.props.handleAttributeChange} /></td>
      </tr>
    )
  }
}

class RecipientAttribute_uncontrolled extends React.Component {
  render() {
    return (
      <tr>
        <td>{this.props.label}:</td>
        <td><input defaultValue={this.props.defaultValue} ref={this.props.refFunc} /></td>
      </tr>
    )
  }
}

class Recipient extends React.Component {

  getButtonText() {
    return this.props.anySelected ? 'Save changes' : 'Save new recipient';
  }

  getKey() {
    return this.props.recipient.number + '.' + this.props.recipient.etag;
  }

  componentDidMount(props) {
    this.props.initCountries()
  }

  render() {

    return (
      <form key={this.getKey()}
        onSubmit= {
          e => {
            e.preventDefault()
            this.props.handleSaveRecipient(this.props.recipient, this.props.postalAddress)
          }
        }
      >
        <table>
          <thead><tr><td>Recipient</td></tr></thead>
          <tbody>
            <RecipientAttribute label="Name" value={this.props.recipient.name} handleAttributeChange={e => {this.props.handleAttributeChange('name', e.target.value)}} />
            <RecipientAttribute label="Email" value={this.props.recipient.email} handleAttributeChange={e => {this.props.handleAttributeChange('email', e.target.value)}} />
            <RecipientAttribute label="Mobile" value={this.props.recipient.mobile} handleAttributeChange={e => {this.props.handleAttributeChange('mobile', e.target.value)}} />
            <RecipientAttribute label="Org. number" value={this.props.recipient.organizationNumber} handleAttributeChange={e => {this.props.handleAttributeChange('organizationNumber', e.target.value)}} />
            <tr><td>Invoice address</td></tr>
            <RecipientAttribute label="Street & number" value={this.props.postalAddress.line1} handleAttributeChange={e => {this.props.handleAddressAttributeChange('line1', e.target.value)}} />
            <RecipientAttribute label="Details" value={this.props.postalAddress.line2} handleAttributeChange={e => {this.props.handleAddressAttributeChange('line2', e.target.value)}} />
            <RecipientAttribute label="Post code" value={this.props.postalAddress.postCode} handleAttributeChange={e => {this.props.handleAddressAttributeChange('postCode', e.target.value)}} />
            <RecipientAttribute label="City" value={this.props.postalAddress.city} handleAttributeChange={e => {this.props.handleAddressAttributeChange('city', e.target.value)}} />
            <CountryAttribute label="Country" countries={this.props.countries} postalAddress={this.props.postalAddress} handleCountryChange={e => {this.props.handleCountryChange(e.target.value)}} />
          </tbody>
          <tfoot><tr><td><button type="submit">{this.getButtonText()}</button></td></tr></tfoot>
        </table>
      </form>
    )
  }
}

class CountryAttribute extends React.Component {
   defCty(address){
    return (address && address.country) || 'USA'
  }

  getCountries() {
    //console.log(zz)
    return this.props.countries || ["UK"]
  }

  renderOption(o) {
    return <option key={o} value={o}>{o}</option>
  }

  render() {
    return (
      <tr>
        <td>Country:</td>
        <td>
          <select value={this.defCty(this.props.postalAddress)} onChange={this.props.handleCountryChange}>
            { this.getCountries().map(country => this.renderOption(country))}
          </select>
        </td>
      </tr>
    )
  }
}

class PostalAddress_uncontrolled extends React.Component {

  getKey() {
    //return this.props.recipient.number + '.' + this.props.recipient.etag;
  }

  componentDidMount(props) {
    //this.props.initCountries()
  }

  render() {
    let line1Input
    let line2Input
    let postCodeInput
    let cityInput

    return (
      <table>
        <thead><tr><td>Postal address</td></tr></thead>
        <tbody>
      <RecipientAttribute label="Address" defaultValue={this.props.address.line1} refFunc={ node => { line1Input = node } } />
        <RecipientAttribute label=" " defaultValue={this.props.address.line2} refFunc={(node) => { line2Input = node }} />
        <RecipientAttribute label="Post code" defaultValue={this.props.address.postCode} refFunc={(node) => { postCodeInput = node }} />
        <RecipientAttribute label="City" defaultValue={this.props.address.city} refFunc={(node) => { cityInput = node }} />
        <CountryAttribute label="Country" countries={this.props.countries} address={this.props.address} handleCountryChange={this.props.handleCountryChange} />
        </tbody>
        <tfoot><tr><td>---</td></tr></tfoot>
      </table>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    //email: 'yyy' + state.recipientReducer.email
    //mobile: state.recipientReducer.mobile
    recipient: state.recipient,
    postalAddress: state.postalAddress,
    countries: state.countries.countries,
    anySelected: state.recipients.anySelected
  }
}

const mapDispatchToProps = dispatch => {
  return {

    //handleSaveRecipient: (email, mobile) => dispatch(saveRecipient(email, mobile))
//    handleSaveRecipient: (email, mobile) => dispatch(saveRecipient2({ email: 'xxx' + email, mobile: mobile}))
    initCountries: () => dispatch({type: 'LOAD_COUNTRIES'}),
    handleSaveRecipient: (recipient, postalAddress) => dispatch({type: 'SAVE_RECIPIENT', recipient: recipient, postalAddress: postalAddress}),
    handleSavePostalAddress: address => dispatch({type: 'PA_SAVE_REQUESTED', address: address}),
    handleCountryChange: v => dispatch({type: 'COUNTRY_SELECTED', country: v}),
    handleAttributeChange: (name, value) => dispatch({type: 'RECIPIENT_ATTRIBUTE_CHANGED', attributeName: name, value: value}),
    handleAddressAttributeChange: (name, value) => dispatch({type: 'POSTAL_ADDRESS_ATTRIBUTE_CHANGED', attributeName: name, value: value})
  }
}

Recipient = connect(mapStateToProps, mapDispatchToProps)(Recipient)

export default Recipient
