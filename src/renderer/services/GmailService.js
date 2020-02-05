import { ipcRenderer } from 'electron'

export default {
  addAccount: () => callIPCMethod('add_account'),
  fetchEmails: accounts => callIPCMethod('fetch_emails', accounts),
  readEmail: (account, msgId) =>
    callIPCMethod('read_email', { account, msgId }),
  readEmails: payload => callIPCMethod('read_emails', payload)
}

function callIPCMethod(method, args) {
  ipcRenderer.send(method, args)

  return new Promise(resolve => {
    ipcRenderer.once(method + '_callback', (ev, result) => {
      resolve(result)
    })
  })
}
