<template lang="pug">
  #app.columns.is-mobile.is-gapless.has-margin-bottom-0
    .column.is-narrow
      sidebar(
        :emails="mailCounts"
        :selected="selectedEmail"
        @select="selectEmail"
        @remove="removeAccount"
        )
    .column
      mail-list(
        :list="messages"
        @read="readMessage"
        @readAll="readAllMessages"
        @delete="deleteMessage"
        @deleteAll="deleteAllMessages"
        @view="viewMessage"
        v-if="!details"
        )
      mail-details(
        :details="details"
        @close="closeDetails"
        @read="readMessage(details)"
        v-if="details")
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'

import MailList from '@/components/MailList.vue'
import MailDetails from '@/components/MailDetails.vue'
import Sidebar from '@/components/Sidebar.vue'

export default {
  name: 'gmail-reader-desktop',
  components: {
    MailList,
    MailDetails,
    Sidebar
  },
  data() {
    return {
      details: null
    }
  },
  computed: mapGetters(['accounts', 'mailCounts', 'messages', 'selectedEmail']),
  methods: {
    ...mapActions('mails', [
      'readMessage',
      'readAllMessages',
      'getMessages',
      'deleteAllMessages'
    ]),
    ...mapMutations({
      selectEmail: 'accounts/SELECT',
      updateAccount: 'accounts/UPDATE_ACCOUNT',
      removeAccount: 'accounts/REMOVE_ACCOUNT',
      deleteMessage: 'mails/DELETE'
    }),
    viewMessage(msg) {
      this.details = msg
    },
    closeDetails() {
      this.details = null
    }
  },
  watch: {
    selectedEmail() {
      this.details = null
    }
  }
}
</script>

<style lang="scss" src="@/assets/styles/main.scss"></style>
