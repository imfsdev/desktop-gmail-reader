import VuexPersistence from 'vuex-persist'

const vuexLocal = new VuexPersistence({
  storage: window.localStorage,
  modules: ['accounts', 'mails', 'syncedAt']
})

export default vuexLocal
