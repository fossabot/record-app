import React from 'react'
import { connect } from 'react-redux'
import { Text, View } from 'react-native'
import { Link } from 'react-router-native'

import { contactlistActions } from '@core/contactlists'
import Contactlist from '@components/Contactlist'
import PageLayout from '@layouts/page'
import headStyles from '@styles/head'

export class ContactsPage extends React.Component {
  componentWillMount () {
    // '/me' or proper orbitdb adadress
    const { logId } = this.props.match.params
    this.props.loadContacts(`/${logId}`)
  }

  render () {
    const { logId } = this.props.match.params
    const head = (
      <View style={headStyles.content}>
        <Text>Contacts</Text>
        {(
          logId === 'me' &&
          <Link style={headStyles.button} to='/contacts/new'>
            <Text>Add Contact</Text>
          </Link>
        )}
      </View>
    )

    const body = (
      <Contactlist />
    )

    return (
      <PageLayout head={head} body={body} />
    )
  }
}

const mapDispatchToProps = {
  loadContacts: contactlistActions.loadContacts
}

export default connect(
  null,
  mapDispatchToProps
)(ContactsPage)
