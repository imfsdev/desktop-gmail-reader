export default {
  namespaced: true,
  state: {
    sync: 'manual',
    interval: 30
  },
  mutations: {
    SET_SYNC(state, sync) {
      state.sync = sync
    },
    SET_INTERVAL(state, interval) {
      state.interval = interval
    }
  },
  actions: {
    save({ commit, dispatch }, config) {
      commit('SET_SYNC', config.sync)
      commit('SET_INTERVAL', config.interval)
      dispatch('autoSync', null, { root: true })
    }
  }
}
