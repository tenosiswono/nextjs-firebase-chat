import { all, put, takeLatest } from 'redux-saga/effects'
import firebase from 'firebase'
import { authConfig } from './../components/firebaseCredentials'

import actionTypes, {
  signInSuccess,
  signInError,
  signOutSuccess,
  signOutError
} from '../actions/authActions'

function * signInProcess () {
  const provider = new firebase.auth.FacebookAuthProvider()
  authConfig.facebookPermissions.forEach(permission => provider.addScope(permission))

  try {
    const result = yield firebase.auth().signInWithPopup(provider)
    const { user: { uid, displayName, photoURL, email } } = result
    firebase.database().ref(`users/${uid}`).set({
      displayName,
      photoURL,
      email,
      lastTimeLoggedIn: firebase.database.ServerValue.TIMESTAMP
    })
    yield put(signInSuccess(uid, displayName, photoURL, email))
  } catch (err) {
    console.log(err)
    yield put(signInError(err.message))
  }
}

function * signOutProcess () {
  try {
    yield firebase.auth().signOut()
    yield put(signOutSuccess())
  } catch (err) {
    yield put(signOutError(err.message))
  }
}

function * authWatcher () {
  yield all([
    takeLatest(actionTypes.SIGNIN, signInProcess),
    takeLatest(actionTypes.SIGNOUT, signOutProcess)
  ])
}

export default authWatcher
