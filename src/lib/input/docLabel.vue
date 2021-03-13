<template>
  <label>{{ docLabel }}</label>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'DocLabel',
  props: {
    prop: {
      type: String,
      required: true
    },
    value: {
      type: [String, Number],
      default: ''
    }
  },
  computed: {
    ...mapGetters([
      'getOptLabel'
      // ...
    ]),
    docLabel() {
      let docName = this.prop.slice(0, -3)
      const idx = docName.lastIndexOf('_')
      if (idx !== -1) {
        docName = docName.substr(idx + 1)
      }
      return this.getOptLabel(docName, this.value)
    }
  }
}
</script>

<style>
</style>