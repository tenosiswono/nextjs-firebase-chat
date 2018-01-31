import Immutable from 'seamless-immutable'
import actionTypes from '../actions/authActions'

export const INITIAL_STATE = Immutable({
  isUserSignedIn: false,
  isInProgress: false,
  hasError: false,
  errorMessage: '',
  uid: 0,
  displayName: '',
  photoURL: '',
  email: ''
})

function reducer (state = INITIAL_STATE, action) {
  switch (action.type) {
    case actionTypes.SIGNIN_SUCCESS:
      const { uid, displayName, photoURL, email } = action
      return state.merge({
        isUserSignedIn: true,
        isInProgress: false,
        uid,
        displayName,
        photoURL,
        email
      })
    case actionTypes.SIGNIN:
      return state.merge({
        isInProgress: true
      })
    case actionTypes.SIGNIN_ERROR:
      return state.merge({
        hasError: true,
        errorMessage: action.errorMessage
      })
    case actionTypes.SIGNOUT_SUCCESS:
      return state.merge({
        isUserSignedIn: false,
        isInProgress: false,
        uid: 0,
        displayName: '',
        photoURL: '',
        email: ''
      })
    case actionTypes.SIGNOUT:
      return state.merge({
        isInProgress: true
      })
    case actionTypes.SIGNOUT_ERROR:
      return state.merge({
        hasError: true,
        errorMessage: action.errorMessage
      })
    default:
      return state
  }
}

export default reducer
