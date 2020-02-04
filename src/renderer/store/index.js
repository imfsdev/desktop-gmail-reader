import Vue from 'vue'
import Vuex from 'vuex'

import modules from './modules'
import vuexLocal from './persist'

Vue.use(Vuex)

const getters = {
  emails: state => {
    const result = {}
    state.accounts.list.forEach(acc => {
      result[acc.email] = 0
    })
    state.mails.list.forEach(msg => {
      if (!msg.read) {
        result[msg.to]++
      }
    })
    return result
  },
  messages: state =>
    state.mails.list.filter(
      msg => !state.accounts.selected || msg.to === state.accounts.selected
    ),
  selectedEmail: state => state.accounts.selected
}

export default new Vuex.Store({
  modules,
  getters,
  plugins: [vuexLocal.plugin],
  strict: process.env.NODE_ENV !== 'production'
})
