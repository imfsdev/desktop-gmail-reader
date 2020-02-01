import Vue from 'vue'

const state = {
  emails: ['abc@test.com', 'dfe@test.com'],
  list: [
    {
      id: '16e90b992d2876c3',
      threadId: '16e9062ce133b10c',
      labels: ['IMPORTANT', 'CATEGORY_PERSONAL', 'INBOX'],
      snippet:
        'Google APIs Explorer was granted access to your Google Account If you did not grant access, you should check this activity and secure your account. Check activity You received ...',
      internalDate: '1574386109000',
      subject: 'Security alert',
      from: 'Google \u003cno-reply@accounts.google.com\u003e',
      to: 'abc@test.com',
      text:
        'Google APIs Explorer was granted access to your Google Account If you did not grant access, you should check this activity and secure your account. Check activity'
    },
    {
      id: '16e90b992d2876c4',
      threadId: '16e9062ce133b10c',
      labels: ['IMPORTANT', 'CATEGORY_PERSONAL', 'INBOX'],
      snippet:
        'Google APIs Explorer was granted access to your Google Account If you did not grant access, you should check this activity and secure your account. Check activity You received ...',
      internalDate: '1574386109000',
      subject: 'Security alert',
      from: 'Google \u003cno-reply@accounts.google.com\u003e',
      to: 'abc@test.com',
      text:
        'Google APIs Explorer was granted access to your Google Account If you did not grant access, you should check this activity and secure your account. Check activity'
    },
    {
      id: '16e90b992d2876c5',
      threadId: '16e9062ce133b10c',
      labels: ['IMPORTANT', 'CATEGORY_PERSONAL', 'INBOX'],
      snippet:
        'Google APIs Explorer was granted access to your Google Account If you did not grant access, you should check this activity and secure your account. Check activity You received ...',
      internalDate: '1574386109000',
      subject: 'Security alert',
      from: 'Google \u003cno-reply@accounts.google.com\u003e',
      to: 'dfe@test.com',
      text:
        'Google APIs Explorer was granted access to your Google Account If you did not grant access, you should check this activity and secure your account. Check activity'
    }
  ],
  selectedEmail: ''
}

const getters = {
  emails: state => {
    const result = {}
    state.emails.forEach(email => {
      result[email] = 0
    })

    state.list.forEach(msg => {
      if (!msg.read) {
        result[msg.to]++
      }
    })
    return result
  },
  list: state =>
    state.list.filter(
      msg => !state.selectedEmail || msg.to === state.selectedEmail
    ),
  selectedEmail: state => state.selectedEmail
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
  },
  SELECT_EMAIL(state, email) {
    state.selectedEmail = email
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
  selectEmail({ commit }, email) {
    commit('SELECT_EMAIL', email)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
