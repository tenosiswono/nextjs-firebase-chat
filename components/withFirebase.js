import React from 'react'
import firebase from 'firebase'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { clientCredentials } from './firebaseCredentials'
import 'isomorphic-fetch'
import { retrieveMessage } from '../actions/messageActions'
import { selectIsUserSignedIn } from '../selectors/authSelector'

type Props = {
  isUserSignedIn: boolean,
  onMessageAdded: Function
}

const withFirebase = (Page) => {
  class WithFirebase extends React.Component<Props> {
    static getInitialProps (context) {
      // If the page has a prop fetcher invoke it
      return Page.getInitialProps ? Page.getInitialProps(context) : {}
    }

    render () {
      return <Page {...this.props} {...this.state} />
    }

    componentDidMount () {
      if (firebase.apps.length === 0) {
        firebase.initializeApp(clientCredentials)
        this.firebaseFunction()
        // if (this.props.isUserSignedIn) this.addDbListener()
      } else {
      }
    }
    saveToken = () => {
      firebase.messaging().getToken().then((currentToken) => {
        if (currentToken) {
          firebase.database().ref('pushTokens/' + currentToken).set(true)
        } else {
          this.requestPermission()
        }
      }).catch((err) => {
        console.error('Unable to get messaging token.', err)
      })
    }
    removeToken = () => {
      firebase.messaging().getToken().then((currentToken) => {
        if (currentToken) {
          firebase.database().ref('pushTokens/' + currentToken).remove()
        }
      }).catch((err) => {
        console.error('Unable to get messaging token.', err)
      })
    }
    requestPermission = () => {
      firebase.messaging().requestPermission().then(() => {
        console.log('Notification permission granted.')
        this.saveToken()
      }).catch((err) => {
        console.error('Unable to get permission to notify.', err)
      })
    }
    firebaseFunction = () => {
      firebase.auth().onAuthStateChanged(user => {
        if (user) {
          return user.getIdToken()
            .then((token) => {
              // eslint-disable-next-line no-undef
              return fetch('/api/login', {
                method: 'POST',
                // eslint-disable-next-line no-undef
                headers: new Headers({ 'Content-Type': 'application/json' }),
                credentials: 'same-origin',
                body: JSON.stringify({ token })
              })
            }).then((res) => {
              this.addDbListener()
              this.saveToken()
            })
        } else {
          // eslint-disable-next-line no-undef
          fetch('/api/logout', {
            method: 'POST',
            credentials: 'same-origin'
          }).then(() => {
            this.removeToken()
            firebase.database().ref('messages').off()
          })
        }
      })
    }

    addDbListener = () => {
      firebase.database().ref('messages').on('child_added', snap => {
        const messages = snap.val()
        if (messages) this.props.onMessageAdded(messages)
      })
    }
  }

  const mapStateToProps = createStructuredSelector({
    isUserSignedIn: selectIsUserSignedIn()
  })

  const mapDispatchToProps = dispatch => {
    return {
      onMessageAdded: (messages) => {
        dispatch(retrieveMessage(messages))
      }
    }
  }

  return connect(
    mapStateToProps,
    mapDispatchToProps
  )(WithFirebase)
}

export default withFirebase
