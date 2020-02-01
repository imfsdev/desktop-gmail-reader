<template lang="pug">
  .mail-item.has-padding-y-2(:class="{'read': item.read}" @click="$emit('open')")
    span.from.is-size-6.has-text-weight-semibold
      span.has-margin-right-2 {{ fromName }}
      small.email {{ fromEmail }}
    .is-size-6 {{ item.subject }}
    .is-size-7.has-text-weight-semibold.has-margin-bottom-2 To: {{ item.to }}
    .snippet.is-size-7 {{ item.snippet }}
    .actions
      b-tooltip(label="Mark as Read" position="is-bottom" type="is-info" animated)
        b-button(type="is-info" @click="$emit('read')" v-if="!item.read")
          b-icon(icon="envelope-open-text" pack="fas" size="is-small")
      b-tooltip.has-margin-left-2(label="Delete" type="is-danger" position="is-bottom" animated)
        b-button(type="is-danger" @click="$emit('delete')" v-if="item.read")
          b-icon(icon="trash-alt" pack="fas" size="is-small")
</template>

<script>
export default {
  name: 'mail-item',
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  computed: {
    fromName() {
      const arr = this.item.from.split(' <')
      return arr[0]
    },
    fromEmail() {
      const arr = this.item.from.split(' <')
      return '<' + arr[1].slice(0)
    }
  }
}
</script>

<style lang="scss" scoped>
.mail-item {
  border-bottom: 1px solid $grey;
  cursor: pointer;
  position: relative;

  .email {
    font-weight: normal;
    opacity: 0;
  }
  .from:hover {
    .email {
      opacity: 1;
    }
  }
  .actions {
    opacity: 0;
    position: absolute;
    right: 0;
    top: 10px;
    transition: opacity 0.3s ease-in-out;
  }
  .snippet {
    color: $grey-light;
    letter-spacing: 0.02em;
  }
  button {
    border-radius: 50%;
  }

  &.read {
    color: $grey;

    .snippet {
      color: rgba($grey-light, 0.5);
    }
  }

  &:hover {
    .actions {
      opacity: 1;
    }
  }
}
</style>
