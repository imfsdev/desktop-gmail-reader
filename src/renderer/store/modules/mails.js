import Vue from 'vue'
import GmailService from '../../services/GmailService'
import { unionBy } from 'lodash'

const state = {
  list: []
}

const mutations = {
  ADD(state, list) {
    state.list = unionBy(state.list, list, 'id')
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
    const auth = await GmailService.getAuthFromTokenAndUpdate(
      acc.token,
      acc.email,
      commit
    )
    await GmailService.readEmail(auth, msg.id)
    commit('READ', msg.id)
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
        emails[msg.email].auth = await GmailService.getAuthFromTokenAndUpdate(
          acc.token,
          acc.email,
          commit
        )
      }
    }

    const accounts = Object.values(emails)
    accounts.forEach(async ({ auth, msgIds }) => {
      await GmailService.readMultipleEmails(auth, msgIds)
      commit('READ_ALL', msgIds)
    })
  },
  deleteAllMessages({ commit, rootGetters }) {
    const msgIds = rootGetters.messages
      .filter(msg => msg.read)
      .map(msg => msg.id)
    commit('DELETE_ALL', msgIds)
  },
  async getMessages({ commit }, { auth, email }) {
    const messages = await GmailService.getEmails(auth, email)
    commit('ADD', messages)
  },
  getAllMessages({ rootGetters, dispatch, commit }) {
    rootGetters.accounts.forEach(async acc => {
      const auth = await GmailService.getAuthFromTokenAndUpdate(
        acc.token,
        acc.email,
        commit
      )
      dispatch('getMessages', { auth, email: acc.email })
      commit('accounts/SET_SYNCED_AT', new Date().getTime(), { root: true })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
