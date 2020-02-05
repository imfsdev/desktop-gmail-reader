import Vue from 'vue'
import Vuex from 'vuex'

import modules from './modules'
import vuexLocal from './persist'

Vue.use(Vuex)

const getters = {
  accounts: state => state.accounts.list,
  mailCounts: state => {
    const result = {}
    state.accounts.list.forEach(acc => {
      result[acc.email] = 0
    })
    state.mails.list.forEach(msg => {
      if (!msg.read) {
        result[msg.email]++
      }
    })
    return result
  },
  messages: state =>
    state.mails.list.filter(
      msg => !state.accounts.selected || msg.email === state.accounts.selected
    ),
  selectedEmail: state => state.accounts.selected,
  selectedAccount: state =>
    state.accounts.list.find(acc => acc.email === state.accounts.selected)
}

export default new Vuex.Store({
  modules,
  getters,
  plugins: [vuexLocal.plugin],
  strict: process.env.NODE_ENV !== 'production'
})
