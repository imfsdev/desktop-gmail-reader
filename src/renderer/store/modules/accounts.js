import GmailService from '../../services/GmailService'

const state = {
  list: [],
  selected: '',
  syncedAt: 0
}

const mutations = {
  SET_LIST(state, list) {
    state.list = list
  },
  ADD_ACCOUNT(state, payload) {
    const index = state.list.findIndex(acc => acc.email === payload.email)
    if (index >= 0) {
      state.splice(index, 1, payload)
    } else {
      state.list = [...state.list, payload]
    }
  },
  UPDATE_ACCOUNT(state, payload) {
    state.list = state.list.map(acc =>
      acc.email === payload.email ? payload : acc
    )
  },
  REMOVE_ACCOUNT(state, payload) {
    state.list = state.list.filter(acc => acc.email !== payload)
  },
  SELECT(state, email) {
    state.selected = email
  },
  SET_SYNCED_AT(state, time) {
    state.syncedAt = time
  }
}

const actions = {
  async addAccount({ commit }) {
    const { err, account, messages } = await GmailService.addAccount()
    if (err) {
      console.log('Login failed', err.message)
      return
    }

    commit('ADD_ACCOUNT', account)
    commit('mails/ADD', messages, { root: true })
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
