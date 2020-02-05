import Vue from 'vue'
import GmailService from '../../services/GmailService'
import { unionBy, values } from 'lodash'

const state = {
  list: []
}

const mutations = {
  ADD(state, list) {
    state.list = unionBy(list, state.list, 'id')
  },
  READ(state, msgId) {
    const msg = state.list.find(msg => msg.id === msgId)
    Vue.set(msg, 'read', true)
  },
  READ_ALL(state, msgIds) {
    state.list = state.list.map(msg => {
      if (msgIds.indexOf(msg.id) >= 0) {
        return {
          ...msg,
          read: true
        }
      }
      return msg
    })
  },
  DELETE(state, msgId) {
    state.list = state.list.filter(msg => msg.id !== msgId)
  },
  DELETE_ALL(state, msgIds) {
    state.list = state.list.filter(msg => msgIds.indexOf(msg.id) < 0)
  }
}

const actions = {
  async readMessage({ commit, rootGetters }, msg) {
    const acc = rootGetters.accounts.find(acc => acc.email === msg.email)
    const updatedAccount = await GmailService.readEmail(acc, msg.id)

    commit('accounts/UPDATE_ACCOUNT', updatedAccount, { root: true })
    commit('READ', msg.id)
  },
  async readAllMessages({ commit, rootGetters }) {
    let emails = {}
    const msgList = rootGetters.messages.filter(msg => !msg.read)
    msgList.forEach(msg => {
      if (emails[msg.email]) {
        emails[msg.email].msgIds.push(msg.id)
      } else {
        emails[msg.email] = {
          msgIds: [msg.id],
          account: rootGetters.accounts.find(acc => acc.email === msg.email)
        }
      }
    })

    const groups = await GmailService.readEmails(values(emails))

    groups.forEach(group => {
      commit('accounts/UPDATE_ACCOUNT', group.account, { root: true })
    })
    commit(
      'READ_ALL',
      msgList.map(msg => msg.id)
    )
  },
  deleteAllMessages({ commit, rootGetters }) {
    const msgIds = rootGetters.messages
      .filter(msg => msg.read)
      .map(msg => msg.id)
    commit('DELETE_ALL', msgIds)
  },
  async getAllMessages({ rootGetters, commit }) {
    const [accounts, messages] = await GmailService.fetchEmails(
      rootGetters.accounts
    )
    commit('ADD', messages)
    commit('accounts/SET_LIST', accounts, { root: true })
    commit('accounts/SET_SYNCED_AT', new Date().getTime(), { root: true })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
