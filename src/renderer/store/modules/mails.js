import Vue from 'vue'
import GmailService from '../../services/GmailService'

const state = {
  list: []
}

const mutations = {
  ADD(state, list) {
    state.list = [...state.list, ...list]
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
  DELETE_ALL(state) {
    state.list = []
  }
}

const actions = {
  async readMessage({ commit, rootGetters }, msg) {
    const acc = rootGetters.accounts.find(acc => acc.email === msg.email)
    const { auth, newToken } = await GmailService.getAuthFromToken(acc.token)
    if (newToken) {
      commit(
        'accounts/UPDATE_ACCOUNT',
        { email: acc.email, token: newToken },
        { root: true }
      )
    }
    await GmailService.readEmail(auth, msg.id)
    commit('READ', msg.id)
  },
  deleteMessage({ commit }, msgId) {
    commit('DELETE', msgId)
  },
  async readAllMessages({ commit, rootGetters }) {
    let emails = {}
    const msgList = rootGetters.messages.filter(msg => !msg.read)
    for (let i = 0; i < msgList.length; i++) {
      const msg = msgList[i]

      if (emails[msg.email]) {
        emails[msg.email].msgIds.push(msg.id)
      } else {
        emails[msg.email] = {
          msgIds: [msg.id]
        }
        const acc = rootGetters.accounts.find(acc => acc.email === msg.email)
        const { auth, newToken } = await GmailService.getAuthFromToken(acc.token)
        if (newToken) {
          commit(
            'accounts/UPDATE_ACCOUNT',
            { email: msg.email, token: newToken },
            { root: true }
          )
        }
        emails[msg.email].auth = auth
      }
    }

    const accounts = Object.values(emails)
    accounts.forEach(async ({ auth, msgIds }) => {
      await GmailService.readMultipleEmails(auth, msgIds)
    })
    commit(
      'READ_ALL',
      msgList.map(msg => msg.id)
    )
  },
  deleteAllMessages({ commit }) {
    commit('DELETE_ALL')
  },
  async getMessages({ commit }, { auth, email }) {
    const messages = await GmailService.getEmails(auth, email)
    commit('ADD', messages)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
