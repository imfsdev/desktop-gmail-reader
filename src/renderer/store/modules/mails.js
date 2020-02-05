import Vue from 'vue'
import GmailService from '@/services/GmailService'

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
  READ_ALL(state) {
    state.list = state.list.map(msg => ({ ...msg, read: true }))
  },
  DELETE(state, msgId) {
    state.list = state.list.filter(msg => msg.id !== msgId)
  },
  DELETE_ALL(state) {
    state.list = []
  }
}

const actions = {
  readMessage({ commit }, msgId) {
    commit('READ', msgId)
  },
  deleteMessage({ commit }, msgId) {
    commit('DELETE', msgId)
  },
  readAllMessages({ commit }) {
    commit('READ_ALL')
  },
  deleteAllMessages({ commit }) {
    commit('DELETE_ALL')
  },
  async getMessages({ commit }, payload) {
    try {
      const messages = await GmailService.getEmails(payload)
      commit('ADD', messages)
    } catch (err) {
      console.log(err)
    }
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
