import React from 'react'
import { connect } from 'react-redux'

import { contactlistActions } from '@core/contactlists'
import PageLayout from '@layouts/page'

export class NewContactPage extends React.Component {
  constructor (props) {
    super(props)

    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleSubmit (event) {
    // TODO: validation
    const data = {
      alias: event.target.alias.value,
      address: event.target.address.value
    }

    if (data.address && data.alias) {
      this.props.addContact('me', data)
    }

    event.preventDefault()
  }

  render () {
    const head = (
      <h1>Add Contact</h1>
    )

    const body = (
      <form onSubmit={this.handleSubmit}>
        <label>
          Alias
          <input type='text' name='alias' placeholder='Contact Nickname' />
        </label>
        <label>
          Address
          <input type='text' name='address' placeholder='/orbitdb/Qm.../record' />
        </label>
        <input className='button' type='submit' value='Submit' />
      </form>
    )

    return (
      <PageLayout head={head} body={body} />
    )
  }
}

const mapDispatchToProps = {
  addContact: contactlistActions.addContact
}

export default connect(
  null,
  mapDispatchToProps
)(NewContactPage)
