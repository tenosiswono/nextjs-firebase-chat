import { createSelector } from 'reselect'

export const selectMessageState = () => (state) => state.message

export const selectIsUserSignedIn = () => createSelector(
  selectMessageState(),
  (subState) => subState.isUserSignedIn
)
export const selectUserMessage = () => createSelector(
  selectMessageState(),
  (subState) => subState.userMessage
)
export const selectIsSending = () => createSelector(
  selectMessageState(),
  (subState) => subState.isSending
)
export const selectHasError = () => createSelector(
  selectMessageState(),
  (subState) => subState.hasError
)
export const selectErrorMessage = () => createSelector(
  selectMessageState(),
  (subState) => subState.errorMessage
)
export const selectMessages = () => createSelector(
  selectMessageState(),
  (subState) => subState.messages
)
