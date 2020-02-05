import Vue from 'vue'
import { unionBy } from 'lodash'

export default {
  UPSERT_ACCOUNTS(state, accounts) {
    state.accounts = unionBy(accounts, state.accounts, 'email')
  },
  UPSERT_ACCOUNT(state, account) {
    state.accounts = unionBy([account], state.accounts, 'email')
  },
  REMOVE_ACCOUNT(state, email) {
    state.accounts = state.accounts.filter(acc => acc.email !== email)
  },
  SELECT_ACCOUNT(state, email) {
    state.selected = email
  },
  SET_SYNCED_AT(state, time) {
    state.syncedAt = time
  },
  ADD_MESSAGES(state, messages) {
    state.messages = unionBy(messages, state.messages, 'id')
  },
  READ_MESSAGE(state, msgId) {
    const msg = state.messages.find(msg => msg.id === msgId)
    Vue.set(msg, 'read', true)
  },
  READ_MESSAGES(state, msgIds) {
    state.messages = state.messages.map(msg => {
      if (msgIds.indexOf(msg.id) >= 0) {
        return {
          ...msg,
          read: true
        }
      }
      return msg
    })
  },
  REMOVE_MESSAGE(state, msgId) {
    state.messages = state.messages.filter(msg => msg.id !== msgId)
  },
  REMOVE_MESSAGES(state, msgIds) {
    state.messages = state.messages.filter(msg => msgIds.indexOf(msg.id) < 0)
  },
  SET_LOADING(state, loading) {
    state.loading = loading
  }
}
