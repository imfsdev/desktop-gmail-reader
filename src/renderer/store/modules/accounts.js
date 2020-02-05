import GmailService from '@/services/GmailService'

const state = {
  list: [],
  selected: '',
  syncedAt: 0
}

const mutations = {
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
  async addAccount({ commit, dispatch }) {
    const token = await GmailService.googleSignIn()
    const { auth } = await GmailService.getAuthFromToken(token)
    const tokenInfo = await auth.getTokenInfo(token.access_token)
    commit('ADD_ACCOUNT', {
      email: tokenInfo.email,
      token
    })
    dispatch(
      'mails/getMessages',
      { auth, email: tokenInfo.email },
      { root: true }
    )
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
