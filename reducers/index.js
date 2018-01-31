import { combineReducers } from 'redux'
import authReducer from './authReducer'
import messageReducer from './messageReducer'

export default () => {
  const rootReducer = combineReducers({
    auth: authReducer,
    message: messageReducer
  })

  return rootReducer
}
