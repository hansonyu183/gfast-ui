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
/*
  <num-input
    v-else-if="itemDesc.type === 'num'"
    :point="2"
    placeholder="请输入数量"
    v-model.number="$attrs.value"
  ></num-input>*/
import DocSelect from './input/docSelect'
import NumInput from './input/numInput'
export default {
  name: 'ErpInput',
  components: {
    DocSelect,
    NumInput
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
      }
    },
  },
  data() {
    return {}
  }
}
</script>

<style>
</style>