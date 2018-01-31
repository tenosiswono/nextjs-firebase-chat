import { all, put, takeLatest, select } from 'redux-saga/effects'
import firebase from 'firebase'
import { selectUid, selectDisplayName, selectPhotoURL } from '../selectors/authSelector'
import { selectUserMessage } from '../selectors/messageSelector'

import actionTypes, {
  sendMessageSuccess,
  sendMessageError
} from '../actions/messageActions'

function * sendMessageProcess () {
  try {
    const uid = yield select(selectUid())
    const displayName = yield select(selectDisplayName())
    const message = yield select(selectUserMessage())
    const photoURL = yield select(selectPhotoURL())
    if (message.length > 0) {
      yield firebase.database().ref('messages').push({
        uid,
        displayName,
        message,
        photoURL,
        createdAt: firebase.database.ServerValue.TIMESTAMP
      })
    }
    yield put(sendMessageSuccess())
  } catch (err) {
    yield put(sendMessageError(err.message))
  }
}

function * authWatcher () {
  yield all([
    takeLatest(actionTypes.SEND_MESSAGE, sendMessageProcess)
  ])
}

export default authWatcher
