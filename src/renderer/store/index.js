import Vue from 'vue'
import Vuex from 'vuex'

import vuexLocal from './persist'
import getters from './getters'
import * as actions from './actions'
import mutations from './mutations'
import configModule from './config.module'

Vue.use(Vuex)

const state = {
  accounts: [],
  selected: '',
  syncedAt: 0,
  messages: [],
  loading: false
}

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations,
  modules: {
    config: configModule
  },
  plugins: [vuexLocal.plugin],
  strict: process.env.NODE_ENV !== 'production'
})
