import React, { Component } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { selectMessages } from '../selectors/messageSelector'

type Props = {
  messages: Array
}

class MessageList extends Component<Props> {
  componentDidMount () {
    this.scrollToBottom()
  }

  componentDidUpdate () {
    this.scrollToBottom()
  }

  scrollToBottom () {
    this.el.scrollTop = this.el.scrollHeight
  }

  render () {
    const { messages } = this.props
    const map = new Map()
    const messageProcessed = []
    messages.forEach((item) => {
      const key = item.createdAt.toLocaleDateString()
      const collection = map.get(key)
      if (!collection) {
        map.set(key, [item])
      } else {
        collection.push(item)
      }
    })
    map.forEach((val, key) => {
      messageProcessed.push(<div key={key} className="msg-group-date">{key}</div>)
      messageProcessed.push(...val.map((msg, index) => {
        const sameAuthor = index > 0 && messages[index - 1].uid === msg.uid
        return (
          <div key={`${key}-${index}`} className="msg-warp clearfix">
            <div>
              {sameAuthor || <a className="pull-left msg-photo">
                <img src={msg.photoURL} className="msg-photo" alt="photo" />
              </a>}
              <div className={`pull-right msg-date ${sameAuthor ? 'msg-date-nopic' : ''}`}>{msg.createdAt.toLocaleTimeString()}</div>
              <div className="msg-body">
                {sameAuthor || <span className="msg-author">{msg.displayName}</span>}
                <div className="msg-text">{msg.message}</div>
              </div>
            </div>
          </div>
        )
      }))
    })
    return (
      <div className="msg-list-container" ref={el => { this.el = el }}>
        <div className="msg-list">
          {messageProcessed}
        </div>
      </div>
    )
  }
}

const mapStateToProps = createStructuredSelector({
  messages: selectMessages()
})

export default connect(
  mapStateToProps
)(MessageList)
