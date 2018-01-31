import Immutable from 'seamless-immutable'
import actionTypes from '../actions/messageActions'

export const INITIAL_STATE = Immutable({
  userMessage: '',
  isSending: false,
  hasError: false,
  errorMessage: '',
  messages: []
})

function reducer (state = INITIAL_STATE, action) {
  switch (action.type) {
    case actionTypes.TYPE_MESSAGE:
      return state.merge({
        userMessage: action.message
      })
    case actionTypes.SEND_MESSAGE:
      return state.merge({
        isSending: true
      })
    case actionTypes.SEND_MESSAGE_SUCCESS:
      return state.merge({
        userMessage: '',
        isSending: false,
        hasError: false,
        errorMessage: ''
      })
    case actionTypes.SEND_MESSAGE_ERROR:
      return state.merge({
        isSending: false,
        hasError: true,
        errorMessage: action.errorMessage
      })
    case actionTypes.RETRIEVE_MESSAGE:
      const { uid, displayName, message, createdAt, photoURL } = action
      return state.merge({
        messages: [
          ...state.messages,
          {
            uid,
            displayName,
            message,
            createdAt,
            photoURL
          }
        ]
      })
    default:
      return state
  }
}

export default reducer
