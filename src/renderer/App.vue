<template lang="pug">
  #app.columns.is-mobile.is-gapless.has-margin-bottom-0
    .column.is-narrow
      sidebar(
        :emails="emails"
        :selected="selectedEmail"
        @select="selectEmail"
        )
    .column
      mail-list(
        :list="list"
        @read="readMessage"
        @readAll="readAllMessages"
        @delete="deleteMessage"
        @deleteAll="deleteAllMessages"
        )
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

import MailList from '@/components/MailList.vue'
import Sidebar from '@/components/Sidebar.vue'

export default {
  name: 'gmail-reader-desktop',
  components: {
    MailList,
    Sidebar
  },
  computed: mapGetters('mails', ['emails', 'list', 'selectedEmail']),
  methods: mapActions('mails', [
    'readMessage',
    'readAllMessages',
    'deleteMessage',
    'deleteAllMessages',
    'selectEmail'
  ])
}
</script>

<style lang="scss" src="@/assets/styles/main.scss"></style>
