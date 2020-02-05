<template lang="pug">
  .container.is-fluid.has-padding-4
    from-email(:from="details.from" size="large")
    .is-size-6.has-margin-top-2.has-margin-bottom-2 {{ details.subject }}
    .is-size-7.has-margin-bottom-3 To: {{ details.to }}
    .is-size-6.text(v-html="details.text")
    .actions
      b-button.close(
        type="is-danger"
        icon-left="times"
        outlined
        @click="$emit('close')"
        )
</template>

<script>
import FromEmail from './FromEmail.vue'

export default {
  name: 'mail-details',
  components: {
    FromEmail
  },
  props: {
    details: {
      type: Object,
      required: true
    }
  },
  mounted() {
    if (!this.details.read) {
      this.$emit('read')
    }
  }
}
</script>

<style scoped>
.container {
  position: relative;
}
.actions {
  position: absolute;
  top: 2em;
  right: 2em;
}
.text {
  background: white;
  color: black;
  display: inline-block;
  padding: 1em;
  word-break: break-word;
}
.close {
  border-radius: 50%;
}
</style>
