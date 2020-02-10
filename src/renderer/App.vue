<template lang="pug">
  #app.columns.is-mobile.is-gapless.has-margin-bottom-0
    .column.is-narrow
      sidebar(
        :counts="mailCounts"
        :selected="selected"
        :expiredEmails="expiredEmails"
        @select="viewAccMessages"
        @remove="removeAccount"
        @settings="view = 'settings'"
        )
    .column
      mail-list(
        :list="filteredMessages"
        @read="readMessage"
        @readAll="readAllFilteredMessages"
        @delete="removeMessage"
        @deleteAll="removeReadFilteredMessages"
        @view="viewMessage"
        v-if="view === 'list'"
        )
      mail-details(
        :details="details"
        @close="closeDetails"
        @read="readMessage(details)"
        v-if="view === 'details'")
      settings(
        @back="view = 'list'"
        v-if="view === 'settings'"
        )
    b-loading(
      :is-full-page="true"
      :active.sync="loading"  
      )
</template>

<script>
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex'

import MailList from '@/components/MailList.vue'
import MailDetails from '@/components/MailDetails.vue'
import Sidebar from '@/components/Sidebar.vue'
import Settings from '@/components/Settings.vue'

export default {
  name: 'gmail-reader-desktop',
  components: {
    MailList,
    MailDetails,
    Sidebar,
    Settings
  },
  data() {
    return {
      details: null,
      view: 'list'
    }
  },
  computed: {
    ...mapState(['selected', 'loading']),
    ...mapState('config', ['sync', 'interval']),
    ...mapGetters(['mailCounts', 'expiredEmails', 'filteredMessages'])
  },
  methods: {
    ...mapActions([
      'readMessage',
      'readAllFilteredMessages',
      'getAllMessages',
      'removeReadFilteredMessages',
      'autoSync'
    ]),
    ...mapMutations({
      selectAccount: 'SELECT_ACCOUNT',
      removeAccount: 'REMOVE_ACCOUNT',
      removeMessage: 'REMOVE_MESSAGE'
    }),
    viewMessage(msg) {
      this.details = msg
      this.view = 'details'
    },
    closeDetails() {
      this.view = 'list'
    },
    viewAccMessages(email) {
      this.selectAccount(email)
      this.view = 'list'
    }
  },
  watch: {
    selected() {
      this.details = null
    }
  },
  mounted() {
    if (this.sync === 'auto') {
      this.autoSync()
    }
  }
}
</script>

<style lang="scss" src="@/assets/styles/main.scss"></style>
