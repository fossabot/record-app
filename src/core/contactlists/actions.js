export const contactlistActions = {
  FETCH_CONTACTS_FAILED: 'FETCH_CONTACTS_FAILED',
  FETCH_CONTACTS_FULFILLED: 'FETCH_CONTACTS_FULFILLED',
  FETCH_CONTACTS_PENDING: 'FETCH_CONTACTS_PENDING',

  LOAD_CONTACTS: 'LOAD_CONTACTS',

  POST_CONTACT_FAILED: 'POST_CONTACT_FAILED',
  POST_CONTACT_FULFILLED: 'POST_CONTACT_FULFILLED',
  POST_CONTACT_PENDING: 'POST_CONTACT_PENDING',

  ADD_CONTACT: 'ADD_CONTACT',

  fetchContactsFailed: error => ({
    type: contactlistActions.FETCH_CONTACTS_FAILED,
    payload: error
  }),

  fetchContactsFulfilled: (logId, data) => ({
    type: contactlistActions.FETCH_CONTACTS_FULFILLED,
    payload: {
      data,
      logId
    }
  }),

  fetchContactsPending: logId => ({
    type: contactlistActions.FETCH_CONTACTS_PENDING,
    payload: {
      logId
    }
  }),

  loadContacts: logId => ({
    type: contactlistActions.LOAD_CONTACTS,
    payload: {
      logId
    }
  }),

  postContactFailed: error => ({
    type: contactlistActions.POST_CONTACT_FAILED,
    payload: error
  }),

  postContactFulfilled: (logId, data) => ({
    type: contactlistActions.POST_CONTACT_FULFILLED,
    payload: {
      logId,
      data
    }
  }),

  postContactPending: logId => ({
    type: contactlistActions.POST_CONTACT_PENDING,
    payload: {
      logId
    }
  }),

  addContact: (logId, data) => ({
    type: contactlistActions.ADD_CONTACT,
    payload: {
      logId,
      data
    }
  })
}

export const contactlistRequestActions = {
  failed: contactlistActions.fetchContactsFailed,
  fulfilled: contactlistActions.fetchContactsFulfilled,
  pending: contactlistActions.fetchContactsPending
}

export const contactlistPostActions = {
  failed: contactlistActions.postContactFailed,
  fulfilled: contactlistActions.postContactFulfilled,
  pending: contactlistActions.postContactPending
}
