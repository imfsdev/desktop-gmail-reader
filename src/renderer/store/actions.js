import GmailService from '../services/GmailService'
import { values } from 'lodash'

export async function addAccount({ commit }) {
  commit('SET_LOADING', true)
  const { err, account, messages } = await GmailService.addAccount()
  if (err) {
    console.log('Login failed', err.message)
    return
  }

  commit('UPSERT_ACCOUNT', account)
  commit('ADD_MESSAGES', messages)
  commit('SET_LOADING', false)
}

export async function getAllMessages({ state, commit }) {
  commit('SET_LOADING', true)
  const [accounts, messages] = await GmailService.fetchEmails(state.accounts)
  commit('ADD_MESSAGES', messages)
  commit('SET_ACCOUNTS', accounts)
  commit('SET_SYNCED_AT', new Date().getTime())
  commit('SET_LOADING', false)
}

export async function readMessage({ commit, state }, msg) {
  commit('SET_LOADING', true)
  const acc = state.accounts.find(acc => acc.email === msg.email)
  const updatedAccount = await GmailService.readEmail(acc, msg.id)

  commit('UPSERT_ACCOUNT', updatedAccount)
  commit('READ_MESSAGE', msg.id)
  commit('SET_LOADING', false)
}

export async function readAllFilteredMessages({ commit, getters, state }) {
  commit('SET_LOADING', true)
  let emails = {}
  const msgList = getters.filteredMessages.filter(msg => !msg.read)
  msgList.forEach(msg => {
    if (emails[msg.email]) {
      emails[msg.email].msgIds.push(msg.id)
    } else {
      emails[msg.email] = {
        msgIds: [msg.id],
        account: state.accounts.find(acc => acc.email === msg.email)
      }
    }
  })

  const groups = await GmailService.readEmails(values(emails))

  groups.forEach(group => {
    commit('UPSERT_ACCOUNT', group.account)
  })
  commit(
    'READ_MESSAGES',
    msgList.map(msg => msg.id)
  )
  commit('SET_LOADING', false)
}

export function removeReadFilteredMessages({ commit, getters }) {
  const msgIds = getters.filteredMessages
    .filter(msg => msg.read)
    .map(msg => msg.id)
  commit('REMOVE_MESSAGES', msgIds)
}
