import React, { Component } from 'react'
import { createStructuredSelector } from 'reselect'
import { connect } from 'react-redux'
import { typeMessage, sendMessage } from '../actions/messageActions'
import { selectUserMessage, selectIsSending, selectHasError, selectErrorMessage } from '../selectors/messageSelector'

type Props = {
  userMessage: string,
  onChangeMessage: Function,
  onSendMessage: Function,
  isSending: boolean,
  hasError: boolean,
  errorMessage: string,
}

class MessageInput extends Component<Props> {
  render () {
    const { userMessage, onSendMessage, onChangeMessage, isSending, hasError, errorMessage } = this.props

    return (
      [
        <div className="msg-error error" key="error">{errorMessage}</div>,
        <div className="msg-input" key="input">
          <textarea
            rows={5}
            type="text"
            onKeyDown={(evt) => {
              if (isSending) {
                evt.preventDefault()
              }
              if (evt.keyCode === 13) {
                onSendMessage()
                evt.preventDefault()
              }
            }}
            onChange={onChangeMessage}
            value={userMessage}
            tab-index={0}
            className={hasError ? 'error' : ''}
            placeholder="Write a message..."
          />
        </div>
      ]
    )
  }
}

const mapStateToProps = createStructuredSelector({
  userMessage: selectUserMessage(),
  isSending: selectIsSending(),
  hasError: selectHasError(),
  errorMessage: selectErrorMessage()
})

const mapDispatchToProps = dispatch => {
  return {
    onChangeMessage: (event) => {
      dispatch(typeMessage(event.target.value))
    },
    onSendMessage: () => {
      dispatch(sendMessage())
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MessageInput)
