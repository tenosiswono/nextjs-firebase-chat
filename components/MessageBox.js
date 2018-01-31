import React, { Component } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import MessageInput from './MessageInput'
import MessageList from './MessageList'
import {
  selectIsUserSignedIn
} from '../selectors/authSelector'

type Props = {
  isUserSignedIn: boolean
}

export class MessageBox extends Component<Props> {
  render () {
    const { isUserSignedIn } = this.props

    return (
      <div className="msg-box">
        { isUserSignedIn && [<MessageList key="list" />, <MessageInput key="input" />] }
        { isUserSignedIn || <div className="login-require">Please login to use chat</div>}
      </div>
    )
  }
}

const mapStateToProps = createStructuredSelector({
  isUserSignedIn: selectIsUserSignedIn()
})

export default connect(
  mapStateToProps
)(MessageBox)
