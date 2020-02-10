<template lang="pug">
  .has-padding-4
    section.has-margin-bottom-4
      h4.is-size-4.has-margin-bottom-2 Synchronization
      .field
        b-radio(v-model="radioVal" native-value="manual") Manual
      .field
        b-radio(v-model="radioVal" native-value="auto") Auto
        b-field.has-margin-top-2.has-padding-left-4.interval(
          label="Interval:"
          )
          b-input(v-model="intervalVal")
          span.has-margin-left-2 (seconds)
    section.has-margin-top-4
      b-button(
        class="has-margin-right-2"
        type="is-info"
        icon-left="save"
        @click="save()"
        ) Save
      b-button(
        type="is-danger"
        icon-left="times"
        @click="$emit('back')"
        ) Cancel
</template>

<script>
import { mapMutations, mapState, mapActions } from 'vuex'
export default {
  name: 'settings',
  computed: mapState('config', ['sync', 'interval']),
  data() {
    return {
      radioVal: 'manual',
      intervalVal: 30
    }
  },
  methods: {
    ...mapMutations({
      setSync: 'config/SET_SYNC',
      setInterval: 'config/SET_INTERVAL'
    }),
    ...mapActions({
      saveConfig: 'config/save'
    }),
    save() {
      this.save({
        sync: this.radioVal,
        interval: this.intervalVal
      })
    }
  },
  mounted() {
    this.radioVal = this.sync
    this.intervalVal = this.interval
  },
  watch: {
    radioVal(newVal) {
      this.setSync(newVal)
    }
  }
}
</script>

<style lang="scss">
.interval {
  display: flex;
  align-items: center;

  .label {
    margin-right: 0.5em;
    margin-bottom: 0 !important;
    color: $white-ter;
  }
  .input {
    background-color: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.2);
    color: $white-ter;
    width: 60px;
  }
}
</style>
