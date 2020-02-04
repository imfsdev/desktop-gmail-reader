import VuexPersistence from 'vuex-persist'

const vuexLocal = new VuexPersistence({
  storage: window.localStorage,
  modules: ['accounts'],
  filter: mutation =>
    mutation.type === 'accounts/UPDATE_ACCOUNT' ||
    mutation.type === 'accounts/ADD_ACCOUNT'
})

export default vuexLocal
