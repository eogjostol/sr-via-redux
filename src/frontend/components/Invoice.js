import React from 'react'
import { saveInvoice } from '../actions'
import { connect } from 'react-redux'
import style from './components.css'
import pikastyle from '../pikaday.css'
import DatePicker from 'react-pikaday-datepicker';

class InvoiceAttribute extends React.Component {
  render() {
    return (
      <tr>
        <td>{this.props.label}:</td>
        <td><input value={this.props.value} onChange={this.props.handleAttributeChange} /></td>
      </tr>
    )
  }
}

class CurrencyAttribute extends React.Component {

  getDefaultCurrency(invoice) {
    let x = { cur: null }
    return (x && x.cur) || 'JPY'
    //return (invoice && invoice.currency) || 'DKK'
  }

  curs(currencies) {
  //let zz = currencies || [{code: '?', name: 'undef', rate: 1}]
  //console.log(zz)
    return currencies || [{code: '?', name: 'undef', rate: 1}]
  }

  getOptions(o) {
     return <option key={o.code} value={o.code}>{o.name}</option>
  }

  render() {
    return (
      <tr>
        <td>Currency:</td>
        <td>
          <select value={this.getDefaultCurrency(this.props.invoice)} onChange={this.props.handleCurrencyChange2}>
            {this.curs(this.props.currencies).map(currency => this.getOptions(currency))}
          </select>
        </td>
      </tr>
    )
  }
}

class DateAttribute extends React.Component {

  render() {
    //console.log('date')
    //console.log(this.props.date)
    return (
      <tr>
        <td>{this.props.label}:</td>
        <td>
          <DatePicker
                  placeholder="Select Date"
                  format="YYYY-MM-DD"
                  maxDate={new Date('2100-12-31')}
                  value={new Date(this.props.date)}
                  onChange={this.props.handleDateChange}
          />
        </td>
      </tr>
    )
  }
}

class Invoice extends React.Component {

  componentDidMount(props) {
    //console.log('init')
    this.props.init();
  }

  render() {
    return (
      <form
        onSubmit= {
          e => {
            e.preventDefault()
            this.props.handleSaveInvoice()
          }
        }
      >
        <table>
          <thead><tr><td>Invoice</td></tr></thead>
          <tbody>
            <InvoiceAttribute label="Text" value={this.props.invoice.text} handleAttributeChange={e => {this.props.handleAttributeChange('text', e.target.value)}} />
            <DateAttribute label="Issue date" date={this.props.invoice.issueDate} handleDateChange={e => {this.props.handleAttributeChange('issueDate', e)}} />
            <DateAttribute label="Due date" date={this.props.invoice.dueDate} handleDateChange={e => {this.props.handleAttributeChange('dueDate', e)}} />
            <InvoiceAttribute label="Account no." value={this.props.invoice.accountNumber} handleAttributeChange={e => {this.props.handleAttributeChange('accountNumber', e.target.value)}} />
            <CurrencyAttribute label="Currency" currencies={this.props.currencies} invoice={this.props.invoice} handleCurrencyChange2={this.props.handleCurrencyChange} />
            <InvoiceAttribute label="Amount" value={this.props.invoice.total} handleAttributeChange={e => {this.props.handleAttributeChange('total', e.target.value)}} />
          </tbody>
          <tfoot><tr><td><button type="submit">Save & send invoice</button></td></tr></tfoot>
        </table>
      </form>
    )
  }
}

const mapStateToProps = state => {
  return {
    invoice: state.invoice,
    currencies: state.currencies.currencies
  }
}

const mapDispatchToProps = dispatch => {
  return {
    init: () => dispatch({type: 'LOAD_CURRENCIES'}),
    handleSaveInvoice: () => dispatch({type: 'INV_SAVE_REQUESTED'}),
    xxxxxhandleSaveInvoice: invoice => dispatch(saveInvoice(invoice)),
    handleCurrencyChange: e => dispatch({type: 'CURRENCY_SELECTED', currency: e.target.value}),
    handleAttributeChange: (name, value) => dispatch({type: 'INV_ATTR_CHANGED', name: name, value: value})
  }
}

Invoice = connect(mapStateToProps, mapDispatchToProps)(Invoice)

export default Invoice
