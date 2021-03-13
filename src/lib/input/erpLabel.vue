<template>
  <div>
    <doc-label
      v-if="itemDesc.type === 'doc'"
      :prop="itemDesc.name"
      :value="value"
      v-on="$listeners"
    />
    <label v-else-if="itemDesc.type === 'date'"> {{ value }}</label>
    <label v-else-if="itemDesc.type === 'month'"> {{ value }}</label>
    <label v-else> {{ value }}</label>
  </div>
</template>

<script>
import DocLabel from './docLabel'
export default {
  name: 'ErpInput',
  components: {
    DocLabel
  },
  props: {
    itemDesc: {
      type: Object,
      request: true,
      default: {
        name: 'item',
        label: 'item',
        type: 'string'
      }
    },
    value: {
      type: [String, Number],
      default: ''
    }
  },
  data() {
    return {
      checkOption: this.$attrs.value,
      itemRules: {
        dict: [],
        date: [],
        month: [],
        dateRange: [],
        monthRange: []
      }
    }
  }
}
</script>

<style>
</style>