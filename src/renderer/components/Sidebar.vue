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
    b-button.has-margin-top-4.is-full-width(
      type="is-info"
      icon-left="plus-circle"
      ) Add
</template>

<script>
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
    list() {
      return Object.keys(this.emails)
    },
    allCount() {
      const counts = Object.values(this.emails)
      return counts.reduce((acc, c) => acc + c, 0)
    }
  }
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

  &:hover,
  &.selected {
    background: rgba($grey, 0.1);
    color: $white-ter;
  }
}
.badge {
  background: rgba($grey, 0.7);
  border-radius: 0.7em;
  font-size: 0.75rem;
  padding: 0.1rem 0.5rem;
}
</style>
