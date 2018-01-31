import Immutable from 'seamless-immutable'

// name spacing with prefix `index/`
const TYPE_MESSAGE = 'message/TYPE_MESSAGE'
const SEND_MESSAGE = 'message/SEND_MESSAGE'
const SEND_MESSAGE_SUCCESS = 'message/SEND_MESSAGE_SUCCESS'
const SEND_MESSAGE_ERROR = 'message/SEND_MESSAGE_ERROR'
const RETRIEVE_MESSAGE = 'message/RETRIEVE_MESSAGE'

// Create Immutable object
const actionTypes = Immutable({
  TYPE_MESSAGE,
  SEND_MESSAGE,
  SEND_MESSAGE_SUCCESS,
  SEND_MESSAGE_ERROR,
  RETRIEVE_MESSAGE
})

// export it
export default actionTypes

export const typeMessage = (message) => {
  return {
    type: actionTypes.TYPE_MESSAGE,
    message
  }
}

export const retrieveMessage = ({ uid, displayName, message, createdAt, photoURL }) => {
  return {
    type: actionTypes.RETRIEVE_MESSAGE,
    uid,
    displayName,
    message,
    photoURL,
    createdAt: new Date(createdAt)
  }
}

export const sendMessage = () => {
  return {
    type: actionTypes.SEND_MESSAGE
  }
}

export const sendMessageSuccess = () => {
  return {
    type: actionTypes.SEND_MESSAGE_SUCCESS
  }
}

export const sendMessageError = () => {
  return {
    type: actionTypes.SEND_MESSAGE_ERROR
  }
}
