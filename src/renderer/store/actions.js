import GmailService from '../services/GmailService'
import { values } from 'lodash'

export async function addAccount({ commit }) {
  commit('SET_LOADING', true)
  const { err, account, messages } = await GmailService.addAccount()
  if (err) {
    commit('SET_LOADING', false)
    console.log('Login failed', err)
    return
  }

  commit('UPSERT_ACCOUNT', account)
  commit('ADD_MESSAGES', messages)
  commit('SET_LOADING', false)
}

export async function getAllMessages({ state, commit }) {
  commit('SET_LOADING', true)
  const accounts = state.accounts.filter(acc => acc.token)
  const [newAccounts, messages] = await GmailService.fetchEmails(accounts)
  commit('ADD_MESSAGES', messages)
  commit('UPSERT_ACCOUNTS', newAccounts)
  commit('SET_SYNCED_AT', new Date().getTime())
  commit('SET_LOADING', false)
}

export async function readMessage({ commit, state }, msg) {
  const acc = state.accounts.find(acc => acc.email === msg.email)
  if (!acc.token) {
    commit('READ_MESSAGE', msg.id)
    return
  }

  commit('SET_LOADING', true)
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

  const payload = values(emails).filter(group => group.account.token)
  const groups = await GmailService.readEmails(payload)

  commit(
    'UPSERT_ACCOUNTS',
    groups.map(group => group.account)
  )
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
