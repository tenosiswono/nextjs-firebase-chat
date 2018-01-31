import { createSelector } from 'reselect'

export const selectAuthState = () => (state) => state.auth

export const selectIsUserSignedIn = () => createSelector(
  selectAuthState(),
  (subState) => subState.isUserSignedIn
)
export const selectIsInProgress = () => createSelector(
  selectAuthState(),
  (subState) => subState.isInProgress
)
export const selectHasError = () => createSelector(
  selectAuthState(),
  (subState) => subState.hasError
)
export const selectErrorMessage = () => createSelector(
  selectAuthState(),
  (subState) => subState.errorMessage
)
export const selectUid = () => createSelector(
  selectAuthState(),
  (subState) => subState.uid
)
export const selectDisplayName = () => createSelector(
  selectAuthState(),
  (subState) => subState.displayName
)
export const selectPhotoURL = () => createSelector(
  selectAuthState(),
  (subState) => subState.photoURL
)
export const selectEmail = () => createSelector(
  selectAuthState(),
  (subState) => subState.email
)
