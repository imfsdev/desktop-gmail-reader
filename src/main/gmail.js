import ElectronGoogleOAuth2 from '@dejay/electron-google-oauth2'
import { google } from 'googleapis'
import { Base64 } from 'js-base64'
import { find, unionBy } from 'lodash'

/**
 * Google sign in flow
 * @returns Token object
 * @throws Error
 */
export async function googleSignIn() {
  const myApiOauth = new ElectronGoogleOAuth2(
    process.env.VUE_APP_GOOGLE_CLIENT_ID,
    process.env.VUE_APP_GOOGLE_CLIENT_SECRET,
    [
      'https://www.googleapis.com/auth/gmail.readonly',
      'https://www.googleapis.com/auth/gmail.modify'
    ],
    {
      successRedirectURL: 'https://github.com'
    }
  )
  const token = await myApiOauth.openAuthWindowAndGetTokens()

  return token
}

/**
 * Get OAuth2Client from Account Object
 * @param account Account object { token, email }
 * @returns OAuth2Client or null
 */
async function getAuthFromAccount(account) {
  try {
    const { auth, newToken } = await getAuthFromToken(account.token)
    if (newToken) {
      account.token = {
        ...newToken,
        refresh_token: account.token.refresh_token
      }
    }

    return auth
  } catch (err) {
    console.log('getAuthFromAccount', err.message || 'Unknown error')
  }

  return null
}

/**
 * Get OAuth2Client from Token Object
 * @param token - Token Object
 * @returns { OAuth2Client, newToken }
 * @throws Error
 */
export async function getAuthFromToken(token) {
  const auth = new google.auth.OAuth2(
    process.env.VUE_APP_GOOGLE_CLIENT_ID,
    process.env.VUE_APP_GOOGLE_CLIENT_SECRET,
    'http://localhost:42813/callback'
  )
  auth.setCredentials(token)

  let newToken
  if (auth.isTokenExpiring()) {
    const response = await auth.refreshToken(token.refresh_token)
    newToken = response.tokens
    newToken.refresh_token = token.refresh_token
  }

  return { auth, newToken }
}

/**
 * Get Token info from Token Object
 * @param token - Token Object
 * @returns Token info object containing email
 */
export async function getTokenInfo(token) {
  try {
    const { auth } = await getAuthFromToken(token)
    const tokenInfo = await auth.getTokenInfo(token.access_token)
    return tokenInfo
  } catch (err) {
    console.log('getTokenInfo', err.message || 'Unknown error')
  }

  return {}
}

/**
 * Get unread messages for email
 * @param account Account Object { token, email }
 * @returns Messages array
 */
export async function getMessagesFromAccount(account) {
  const auth = await getAuthFromAccount(account)

  if (!auth) {
    return []
  }

  const messages = await getMessages(auth)

  return messages.map(msg => ({
    ...msg,
    email: account.email
  }))
}

/**
 * Get unread messages for all registered accounts
 * @param payload Account object array [ { token, email } ]
 */
export async function getAllMessags(payload) {
  let messages = []

  for (let i = 0; i < payload.length; i++) {
    const auth = await getAuthFromAccount(payload[i])
    if (!auth) {
      continue
    }

    const msgs = await getMessages(auth)
    messages = unionBy(
      messages,
      msgs.map(msg => ({
        ...msg,
        email: payload[i].email
      })),
      'id'
    )
  }

  return messages
}

/**
 * Get unread messages
 * @param auth OAuth2Client
 * @returns Messages array
 */
async function getMessages(auth) {
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
            const htmlPart = find(msg.payload.parts, { mimeType: 'text/html' })
            if (htmlPart) {
              body = htmlPart.body.data
            } else {
              const textPart = find(msg.payload.parts, {
                mimeType: 'text/plain'
              })
              body = textPart.body.data
            }
          }
          body = Base64.decode(body)

          return {
            id: msg.id,
            threadId: msg.threadId,
            labels: msg.labelIds,
            snippet: msg.snippet,
            internalDate: msg.internalDate,
            subject: find(msg.payload.headers, { name: 'Subject' }).value,
            from: find(msg.payload.headers, { name: 'From' }).value,
            to: find(msg.payload.headers, { name: 'To' }).value,
            text: body
          }
        })
      )
    }

    return messages
  } catch (err) {
    console.log('getEmails', err.message || 'Unknown error')
  }

  return []
}

/**
 * Mark a message as READ
 * @param account Account Object
 * @param msgId Message Id to read
 */
export async function readMessage(account, msgId) {
  try {
    const auth = await getAuthFromAccount(account)
    if (!auth) {
      return
    }

    const gmail = google.gmail({ version: 'v1', auth })

    await gmail.users.messages.modify({
      userId: 'me',
      id: msgId,
      requestBody: {
        removeLabelIds: ['UNREAD']
      }
    })
  } catch (err) {
    console.log('readEmail', err.message || 'Unknown error')
  }
}

/**
 * Mark all messages as READ
 * @param payload [ { account, msgIds } ]
 */
export async function readMessages(payload) {
  for (let i = 0; i < payload.length; i++) {
    await readMultipleMessages(payload[i].account, payload[i].msgIds)
  }
}

/**
 * Mark multiple messages for an email
 * @param account Account object { token, email }
 * @param msgIds Message IDs array
 */
async function readMultipleMessages(account, msgIds) {
  try {
    const auth = await getAuthFromAccount(account)

    const gmail = google.gmail({ version: 'v1', auth })

    await gmail.users.messages.batchModify({
      userId: 'me',
      requestBody: {
        ids: msgIds,
        removeLabelIds: ['UNREAD']
      }
    })
  } catch (err) {
    console.log('readMultipleMessages', err.message || 'Unknown error')
  }
}
