<template lang="pug">
  .from.has-text-weight-semibold(:class="'is-'+size")
    span.has-margin-right-2 {{ fromName }}
    small.email {{ fromEmail }}
</template>

<script>
export default {
  name: 'from-email',
  props: {
    from: {
      type: String,
      required: true
    },
    size: {
      type: String,
      default: 'normal'
    }
  },
  computed: {
    fromName() {
      const arr = this.from.split(' <')
      return arr[0]
    },
    fromEmail() {
      const arr = this.from.split(' <')
      return '<' + arr[1].slice(0)
    }
  }
}
</script>

<style lang="scss" scoped>
.email {
  font-weight: normal;
  opacity: 0;
  transition: opacity 0.3s ease-in-out;
}
.from:hover {
  .email {
    opacity: 1;
  }
}
.is-large {
  font-size: $size-5;
}
.is-normal {
  font-size: $size-6;
}
</style>
