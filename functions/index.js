'use strict';

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

exports.sendChatNotification = functions.database.ref('/messages/{message}').onWrite(event => {
  const { displayName, message, photoURL } = event.data.val();
  console.log({ displayName, message, photoURL })

  // Get the list of device notification tokens.
  const getDeviceTokensPromise = admin.database().ref(`/pushTokens`).once('value');

  return Promise.resolve(getDeviceTokensPromise).then(tokensSnapshot => {
    // Check if there are any device tokens.
    if (!tokensSnapshot.hasChildren()) {
      return console.log('There are no notification tokens to send to.');
    }
    console.log('There are', tokensSnapshot.numChildren(), 'tokens to send notifications to.');
    // Notification details.
    const payload = {
      data: {
        notification: JSON.stringify({
          title: `New message from ${displayName}`,
          body: message,
          icon: photoURL,
          tag: 'notification',
          url: 'https://nextjs-firebase-chat.now.sh/'
        })
      }
    };

    // Listing all tokens.
    const tokens = Object.keys(tokensSnapshot.val());

    // Send notifications to all tokens.
    return admin.messaging().sendToDevice(tokens, payload).then(response => {
      // For each message check if there was an error.
      const tokensToRemove = [];
      response.results.forEach((result, index) => {
        const error = result.error;
        if (error) {
          console.error('Failure sending notification to', tokens[index], error);
          // Cleanup the tokens who are not registered anymore.
          if (error.code === 'messaging/invalid-registration-token' ||
              error.code === 'messaging/registration-token-not-registered') {
            tokensToRemove.push(tokensSnapshot.ref.child(tokens[index]).remove());
          }
        }
      });
      return Promise.all(tokensToRemove);
    });
  });
});
