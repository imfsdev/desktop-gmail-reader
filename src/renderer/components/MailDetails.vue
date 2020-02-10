<template lang="pug">
  .has-padding-4
    .columns.is-mobile.is-gapless.is-vcentered.has-margin-bottom-0
      .column.is-narrow
        b-button.back(
          type="is-dark"
          icon-left="arrow-left"
          outlined
          @click="$emit('close')"
          )
      .column
        from-email(:from="details.from" size="large")
    .is-size-6.has-margin-top-2.has-margin-bottom-2 {{ details.subject }}
    .is-size-7.has-margin-bottom-3 To: {{ details.to }}
    .is-size-6.content
      iframe(ref="body")
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
    const iframedoc =
      this.$refs.body.contentDocument || this.$refs.body.contentWindow.document
    iframedoc.body.innerHTML = this.details.text
    this.$nextTick(() => {
      const links = iframedoc.querySelectorAll('a[href]')
      links.forEach(link => {
        link.onclick = ev => {
          alert(link.getAttribute('href'))
          ev.preventDefault()
        }
      })
    })
  }
}
</script>

<style lang="scss" scoped>
.container {
  position: relative;
}
.actions {
  position: absolute;
  top: 2em;
  right: 2em;
}
.content {
  background: white;
  word-break: break-word;
  height: calc(100vh - 180px);

  iframe {
    width: 100%;
    height: 100%;
  }
}
.back {
  border-radius: 50%;
  margin-right: 0.5em;

  &.button.is-dark.is-outlined {
    color: $grey-light;
  }
}
</style>
