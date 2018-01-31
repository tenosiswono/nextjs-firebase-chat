/* @flow */
import React, { Component } from 'react'
import Header from '../components/Header'
import MessageBox from '../components/MessageBox'
import { withReduxSaga } from '../store'
import withFirebase from '../components/withFirebase'
import { signInSuccess } from '../actions/authActions'

type Props = {}

class Index extends Component<Props> {
  static async getInitialProps ({ store, req, query }) {
    const user = req && req.session ? req.session.decodedToken : null
    if (user) {
      const { uid, name: displayName, picture: photoURL, email } = user
      store.dispatch(signInSuccess(uid, displayName, photoURL, email))
    }
    return { user }
  }
  render () {
    return <div>
      <Header />
      <MessageBox />
    </div>
  }
}

export default withReduxSaga(withFirebase(Index))
