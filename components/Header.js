/* @flow */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { signIn, signOut } from '../actions/authActions'
import {
  selectIsUserSignedIn,
  selectPhotoURL
} from '../selectors/authSelector'
import Button from '../components/Button'

type Props = {
  onSignInClick: Function,
  onSignOutClick: Function,
  isUserSignedIn: boolean,
  photoURL?: string
}

class Header extends Component<Props> {
  render () {
    const { onSignInClick, isUserSignedIn, photoURL, onSignOutClick } = this.props
    return (
      <div className="header">
        <div className="logo">
          <img src="../static/favicon.png" />
          <span>nextjs-firebase-chat</span>
        </div>
        <nav>
          { isUserSignedIn
            ? <div className="sign-in-nav"><img src={photoURL} className="profile-img" /><Button onClick={onSignOutClick}>Logout</Button></div>
            : <Button onClick={onSignInClick}>Login</Button>
          }
        </nav>
      </div>
    )
  }
}

const mapStateToProps = createStructuredSelector({
  isUserSignedIn: selectIsUserSignedIn(),
  photoURL: selectPhotoURL()
})

const mapDispatchToProps = dispatch => {
  return {
    onSignInClick: () => {
      dispatch(signIn())
    },
    onSignOutClick: () => {
      dispatch(signOut())
    }
  }
}

const HeaderContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Header)

export default HeaderContainer
