import { ipcRenderer } from 'electron'
const { google } = require('googleapis')

export default {
  googleSignIn,
  getAuthFromToken
}

function googleSignIn() {
  ipcRenderer.send('google_auth')

  return new Promise(resolve => {
    ipcRenderer.once('google_auth_callback', (ev, result) => {
      resolve(result)
    })
  })
}

async function getAuthFromToken(token) {
  const auth = new google.auth.OAuth2(
    process.env.VUE_APP_GOOGLE_CLIENT_ID,
    process.env.VUE_APP_GOOGLE_CLIENT_SECRET,
    'http://localhost:42813/callback`'
  )
  auth.setCredentials(token)

  let newToken
  if (auth.isTokenExpiring()) {
    newToken = await auth.refreshToken(token.refresh_token)
  }

  return { auth, newToken }
}
