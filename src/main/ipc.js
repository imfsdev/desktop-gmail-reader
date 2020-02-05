import { ipcMain } from 'electron'
import {
  googleSignIn,
  getTokenInfo,
  getMessagesFromAccount,
  getAllMessags,
  readMessage,
  readMessages
} from './gmail'

ipcMain.on('add_account', event => {
  let token, email

  googleSignIn()
    .then(user => {
      token = user
      return getTokenInfo(token)
    })
    .then(userInfo => {
      email = userInfo.email
      return getMessagesFromAccount({ token, email })
    })
    .then(messages => {
      event.reply('add_account_callback', {
        account: { token, email },
        messages
      })
    })
    .catch(err => {
      event.reply('add_account_callback', { err })
    })
})

ipcMain.on('fetch_emails', (event, args) => {
  getAllMessags(args).then(messages => {
    event.reply('fetch_emails_callback', [args, messages])
  })
})

ipcMain.on('read_email', (event, args) => {
  readMessage(args.account, args.msgId).then(() => {
    event.reply('read_email_callback', args.account)
  })
})

ipcMain.on('read_emails', (event, args) => {
  readMessages(args).then(() => {
    event.reply('read_emails_callback', args)
  })
})
