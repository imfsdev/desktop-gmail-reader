<template lang="pug">
  .container.is-fluid.has-padding-4
    .list-toolbar.has-padding-bottom-3
      b-button(
        class="has-margin-right-2"
        type="is-info"
        icon-left="envelope-open-text"
        :disabled="isAllRead"
        @click="$emit('readAll')"
        ) Mark All as Read
      b-button(
        type="is-danger"
        icon-left="envelope-open-text"
        :disabled="!hasReadEmail"
        @click="$emit('deleteAll')"
        ) Delete All
    mail-item(
      :key="item.id"
      :item="item"
      @read="readMessage(item)"
      @delete="deleteMessage(item)"
      @view="view(item)"
      v-for="item in list"
      )
</template>

<script>
import MailItem from '@/components/MailItem.vue'

export default {
  name: 'mail-list',
  components: {
    MailItem
  },
  props: {
    list: {
      type: Array,
      required: true
    }
  },
  computed: {
    isAllRead() {
      return this.list.every(msg => msg.read)
    },
    hasReadEmail() {
      return this.list.some(msg => msg.read)
    }
  },
  methods: {
    readMessage(msg) {
      this.$emit('read', msg.id)
    },
    deleteMessage(msg) {
      this.$emit('delete', msg.id)
    },
    view(item) {
      window.open('https://www.google.com', '_blank')
    }
  }
}
</script>

<style lang="scss" scoped>
.list-toolbar {
  border-bottom: 1px solid $grey-light;
}
</style>
