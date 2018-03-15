import { takeLatest, fork, put, call } from 'redux-saga/effects'

import { dbActions } from '@core/db'
import { fetchInit, fetchAddress } from '@core/api'

export function* initDB() {
  yield call(fetchInit)
}

export function* watchDB_INIT() {
  yield takeLatest(dbActions.DB_INIT, initDB)
}

export function* loadDB({ payload }) {
  yield call(fetchAddress, payload)
}

export function* watchDB_LOAD() {
  yield takeLatest(dbActions.DB_LOAD, loadDB)
}

export const dbSagas = [
  fork(watchDB_INIT),
  fork(watchDB_LOAD)
]
