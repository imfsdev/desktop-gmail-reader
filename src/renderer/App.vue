<template lang="pug">
  #app.columns.is-mobile.is-gapless.has-margin-bottom-0
    .column.is-narrow
      sidebar(
        :emails="mailCounts"
        :selected="selected"
        @select="selectAccount"
        @remove="removeAccount"
        )
    .column
      mail-list(
        :list="filteredMessages"
        @read="readMessage"
        @readAll="readAllFilteredMessages"
        @delete="removeMessage"
        @deleteAll="removeReadFilteredMessages"
        @view="viewMessage"
        v-if="!details"
        )
      mail-details(
        :details="details"
        @close="closeDetails"
        @read="readMessage(details)"
        v-if="details")
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
  computed: {
    ...mapState(['selected', 'loading']),
    ...mapGetters(['mailCounts', 'filteredMessages'])
  },
  methods: {
    ...mapActions([
      'readMessage',
      'readAllFilteredMessages',
      'getAllMessages',
      'removeReadFilteredMessages'
    ]),
    ...mapMutations({
      selectAccount: 'SELECT_ACCOUNT',
      removeAccount: 'REMOVE_ACCOUNT',
      removeMessage: 'REMOVE_MESSAGE'
    }),
    viewMessage(msg) {
      this.details = msg
    },
    closeDetails() {
      this.details = null
    }
  },
  watch: {
    selected() {
      this.details = null
    }
  }
}
</script>

<style lang="scss" src="@/assets/styles/main.scss"></style>
