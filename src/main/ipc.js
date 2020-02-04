import { ipcMain } from 'electron'
import { googleSignIn } from './gmail'

ipcMain.on('google_auth', event => {
  googleSignIn()
    .then(user => {
      event.reply('google_auth_callback', user)
    })
    .catch(err => {
      event.reply('google_auth_callback', err)
    })
})
