import Immutable from 'seamless-immutable'

// name spacing with prefix `index/`
const SIGNIN = 'auth/SIGNIN'
const SIGNIN_SUCCESS = 'auth/SIGNIN_SUCCESS'
const SIGNIN_ERROR = 'auth/SIGNIN_ERROR'
const SIGNOUT = 'auth/SIGNOUT'
const SIGNOUT_SUCCESS = 'auth/SIGNOUT_SUCCESS'
const SIGNOUT_ERROR = 'auth/SIGNOUT_ERROR'

// Create Immutable object
const actionTypes = Immutable({
  SIGNIN,
  SIGNIN_SUCCESS,
  SIGNIN_ERROR,
  SIGNOUT,
  SIGNOUT_SUCCESS,
  SIGNOUT_ERROR
})

// export it
export default actionTypes

/* Action Creator */
export function signInSuccess (uid, displayName, photoURL, email) {
  return {
    type: actionTypes.SIGNIN_SUCCESS,
    uid,
    displayName,
    photoURL,
    email
  }
}

export function signIn () {
  return {
    type: actionTypes.SIGNIN
  }
}

export function signInError (errorMessage) {
  return {
    type: actionTypes.SIGNIN_ERROR,
    errorMessage
  }
}

export function signOutSuccess () {
  return {
    type: actionTypes.SIGNOUT_SUCCESS
  }
}

export function signOut () {
  return {
    type: actionTypes.SIGNOUT
  }
}

export function signOutError (errorMessage) {
  return {
    type: actionTypes.SIGNOUT_ERROR,
    errorMessage
  }
}
