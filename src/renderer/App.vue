<template lang="pug">
  #app.columns.is-mobile.is-gapless.has-margin-bottom-0
    .column.is-narrow
      sidebar(
        :counts="mailCounts"
        :selected="selected"
        :expiredEmails="expiredEmails"
        @select="viewAccMessages"
        @remove="showConfirmDialog"
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
    b-modal(
      :active.sync="showConfirm"
      has-modal-card
      trap-focus
      )
      .modal-card
        header.modal-card-head
          .modal-card-title Remove account
        section.modal-card-body.has-text-grey-dark Do you want to remove this account?
        footer.modal-card-foot
          b-button(
            type="is-danger"
            @click="confirmRemoveAccount"
            ) Yes
          b-button(outlined @click="showConfirm = false") No
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
      view: 'list',
      showConfirm: false,
      msgId: ''
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
    },
    showConfirmDialog(email) {
      this.email = email
      this.showConfirm = true
    },
    confirmRemoveAccount() {
      this.showConfirm = false
      this.removeAccount(this.email)
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

<style lang="scss" scoped>
.modal-card-foot {
  justify-content: flex-end;

  .button {
    width: 60px;
  }
}
</style>
