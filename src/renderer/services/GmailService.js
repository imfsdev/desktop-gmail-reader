import { ipcRenderer } from 'electron'
import { google } from 'googleapis'
import { Base64 } from 'js-base64'
import utils from './UtilsService'

export default {
  googleSignIn,
  getAuthFromToken,
  getEmails
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
    'http://localhost:42813/callback'
  )
  auth.setCredentials(token)

  let newToken
  if (auth.isTokenExpiring()) {
    newToken = await auth.refreshToken(token.refresh_token)
  }

  return { auth, newToken }
}

async function getEmails({ auth, email }) {
  try {
    const gmail = google.gmail({ version: 'v1', auth })

    const { data } = await gmail.users.threads.list({
      userId: 'me',
      labelIds: ['UNREAD']
    })

    if (!data.threads) {
      return []
    }

    let threadIds = data.threads.map(t => t.id)

    let messages = []

    for (let i = 0; i < threadIds.length; i++) {
      const { data: threadObj } = await gmail.users.threads.get({
        userId: 'me',
        id: threadIds[i]
      })

      if (!threadObj.messages) {
        continue
      }

      messages = messages.concat(
        threadObj.messages.map(msg => {
          let body = ''
          if (msg.payload.body.data) {
            body = msg.payload.body.data
          } else {
            const textPart = utils.getObjFromArray(
              msg.payload.parts,
              'mimeType',
              'text/plain'
            )
            if (textPart) {
              body = textPart.body.data
            } else {
              const htmlPart = utils.getObjFromArray(
                msg.payload.parts,
                'mimeType',
                'text/html'
              )
              body = htmlPart.body.data
            }
          }
          body = Base64.decode(body)

          return {
            id: msg.id,
            threadId: msg.threadId,
            email,
            labels: msg.labelIds,
            snippet: msg.snippet,
            internalDate: msg.internalDate,
            subject: utils.getObjFromArray(
              msg.payload.headers,
              'name',
              'Subject'
            ).value,
            from: utils.getObjFromArray(msg.payload.headers, 'name', 'From')
              .value,
            to: utils.getObjFromArray(msg.payload.headers, 'name', 'To').value,
            text: body
          }
        })
      )
    }

    return messages
  } catch (err) {
    console.log(err.message || 'Unknown error')
  }

  return []
}
