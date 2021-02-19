<template>
  <doc-select
    v-if="itemDesc.type === 'doc'"
    :prop="itemDesc.name"
    v-bind="$attrs"
    v-on="$listeners"
  />
  <el-date-picker
    v-else-if="itemDesc.type === 'date'"
    type="date"
    placeholder="选择日期"
    format="yyyy 年 MM 月 dd 日"
    value-format="yyyyMMdd"
    v-bind="$attrs"
    v-on="$listeners"
  />
  <el-date-picker
    v-else-if="itemDesc.type === 'month'"
    type="month"
    placeholder="选择月"
    format="yyyy 年 MM 月"
    value-format="yyyyMM"
    v-bind="$attrs"
    v-on="$listeners"
  />
  <el-input v-else v-bind="$attrs" v-on="$listeners" />
</template>

<script>
import DocSelect from './docSelect'
export default {
  name: 'ErpInput',
  components: {
    DocSelect
  },
  props: {
    itemDesc: {
      type: Object,
      request: true,
      default: function () {
        return {
          name: 'item',
          label: 'item',
          type: 'string'
        }
      },
      readOnly: false
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