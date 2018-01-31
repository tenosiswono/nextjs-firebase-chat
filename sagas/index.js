import { all } from 'redux-saga/effects'
import authSaga from './authSaga'
import messageSaga from './messageSaga'

export default function * rootSaga () {
  yield all([
    authSaga(),
    messageSaga()
  ])
}
