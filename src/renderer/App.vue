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
        )
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'

import MailList from '@/components/MailList.vue'
import Sidebar from '@/components/Sidebar.vue'
import GmailService from '@/services/GmailService'

export default {
  name: 'gmail-reader-desktop',
  components: {
    MailList,
    Sidebar
  },
  computed: mapGetters(['accounts', 'mailCounts', 'messages', 'selectedEmail']),
  methods: {
    ...mapActions('mails', [
      'readMessage',
      'readAllMessages',
      'deleteMessage',
      'deleteAllMessages',
      'getMessages'
    ]),
    ...mapMutations({
      selectEmail: 'accounts/SELECT',
      updateAccount: 'accounts/UPDATE_ACCOUNT',
      removeAccount: 'accounts/REMOVE_ACCOUNT'
    })
  },
  mounted() {
    this.accounts.forEach(async acc => {
      try {
        const { auth, newToken } = await GmailService.getAuthFromToken(
          acc.token
        )
        if (newToken) {
          this.updateAccount({
            email: acc.email,
            token: newToken
          })
        }
        this.getMessages({ auth, email: acc.email })
      } catch (err) {
        console.log(err)
      }
    })
  }
}
</script>

<style lang="scss" src="@/assets/styles/main.scss"></style>
