<template lang="pug">
  .mail-item.has-padding-y-2(:class="{'read': item.read}" @click="$emit('open')")
    from-email(:from="item.from")
    .is-size-6 {{ item.subject }}
    .is-size-7.has-text-weight-semibold.has-margin-bottom-2 To: {{ item.to }}
    .snippet.is-size-7 {{ item.snippet }}
    .actions.has-padding-right-2
      b-tooltip(
        label="View"
        position="is-bottom"
        type="is-white"
        animated
        )
        b-button(
          icon-left="eye"
          @click="$emit('view')")
      b-tooltip.has-margin-left-2(
        label="Mark as Read"
        position="is-bottom"
        type="is-info"
        animated
        v-if="!item.read"
        )
        b-button(
          type="is-info"
          icon-left="envelope-open-text"
          @click="$emit('read')")
      b-tooltip.has-margin-left-2(
        label="Delete"
        type="is-danger"
        position="is-bottom"
        animated
        v-if="item.read"
        )
        b-button(
          type="is-danger"
          icon-left="trash-alt"
          @click="$emit('delete')")
</template>

<script>
import FromEmail from '@/components/FromEmail'

export default {
  name: 'mail-item',
  components: {
    FromEmail
  },
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
    background-color: rgba($grey, 0.05);

    .actions {
      opacity: 1;
    }
  }
}
</style>
