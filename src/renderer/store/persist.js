import VuexPersistence from 'vuex-persist'

const vuexLocal = new VuexPersistence({
  storage: window.localStorage,
  modules: ['accounts', 'messages', 'syncedAt', 'config']
})

export default vuexLocal
