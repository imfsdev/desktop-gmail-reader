<template lang="pug">
  .sidebar.has-padding-y-4.has-padding-x-2
    .item.has-padding-2(
      :class="{ selected: !selected }"
      @click="$emit('select', '')"
      )
      span All Emails
      span.badge(v-if="allCount > 0") {{ allCount }}
    .item.has-padding-2(
      :class="{ selected: selected === item }"
      @click="$emit('select', item)"
      v-for="item in list"
      )
      span {{ item }}
      span.badge(v-if="emails[item] > 0") {{ emails[item] }}
      b-button.remove(icon-left="times-circle" @click="$emit('remove', item)")
    b-button.has-margin-top-4.is-full-width(
      type="is-info"
      icon-left="plus-circle"
      @click="addAccount()"
      ) Add
    b-button.has-margin-top-3.is-full-width(
      icon-left="sync"
      type="is-warning"
      outlined
      @click="getAllMessages()"
      ) Sync
    .has-margin-top-3.is-full-width.synced
      span.has-margin-right-2 Synced:
      span.has-text-weight-semibold.has-text-grey-lighter {{ syncedTime }}
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  name: 'sidebar',
  props: {
    emails: {
      type: Object,
      required: true
    },
    selected: {
      type: String,
      required: true
    }
  },
  computed: {
    ...mapState(['syncedAt']),
    list() {
      return Object.keys(this.emails)
    },
    allCount() {
      const counts = Object.values(this.emails)
      return counts.reduce((acc, c) => acc + c, 0)
    },
    syncedTime() {
      return new Date(this.syncedAt).toLocaleString()
    }
  },
  methods: mapActions({
    addAccount: 'addAccount',
    getAllMessages: 'getAllMessages'
  })
}
</script>

<style lang="scss" scoped>
.sidebar {
  cursor: pointer;
  height: 100%;
  transition: background-color 0.3s ease-in-out, color 0.3s ease-in-out;
  width: $sidebar-size;
}
.item {
  align-items: center;
  border-bottom: 1px solid rgba($grey, 0.3);
  display: flex;
  justify-content: space-between;
  position: relative;

  .remove {
    opacity: 0;
  }

  &:hover,
  &.selected {
    background: rgba($grey, 0.1);
    color: $white-ter;
  }

  &:hover {
    .remove {
      opacity: 0.8;
    }
    .badge {
      opacity: 0;
    }
  }
}
.badge {
  background: rgba($grey, 0.7);
  border-radius: 0.7em;
  font-size: 0.75rem;
  padding: 0.1rem 0.5rem;
}
.remove {
  background: transparent;
  border: none;
  border-radius: 50%;
  color: white !important;
  padding: 0px;
  position: absolute;
  right: 4px;
  height: 24px;
  width: 24px;
}
.synced {
  text-align: center;
}
</style>
