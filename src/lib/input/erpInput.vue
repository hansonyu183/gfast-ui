<template>
  <doc-select
    v-if="itemDesc.type === 'doc' || itemDesc.type === 'docKey'"
    :prop="itemDesc.name"
    v-bind="$attrs"
    v-on="$listeners"
  />
  <dict-select
    v-else-if="itemDesc.type === 'dict'"
    :prop="itemDesc.name"
    v-bind="$attrs"
    v-on="$listeners"
  />
  <sq-price-select
    v-else-if="itemDesc.type === 'sqPrice'"
    :prop="itemDesc.name"
    v-bind="$attrs"
    v-on="$listeners"
  />
  <eba-select
    v-else-if="itemDesc.type === 'eba'"
    :prop="itemDesc.name"
    v-bind="$attrs"
    v-on="$listeners"
  />
  <el-date-picker
    v-else-if="itemDesc.type === 'date'"
    type="date"
    placeholder="选择日期"
    format="yyyy-MM-dd"
    value-format="yyyyMMdd"
    v-bind="$attrs"
    v-on="$listeners"
  />
  <el-date-picker
    v-else-if="itemDesc.type === 'month'"
    type="month"
    placeholder="选择月"
    format="yyyy-MM"
    value-format="yyyyMM"
    v-bind="$attrs"
    v-on="$listeners"
  />
  <el-input v-else-if="itemDesc.type === 'num'" v-bind="$attrs" v-on="$listeners" />
  <el-input
    v-else-if="itemDesc.type === 'amo'"
    v-bind="$attrs"
    v-on="$listeners"
    @input="onInput"
  />
  <el-input v-else-if="itemDesc.type === 'unum'" v-bind="$attrs" v-on="$listeners" />
  <el-input v-else-if="itemDesc.type === 'uamo'" v-bind="$attrs" v-on="$listeners" />

  <el-input v-else :validate-event="false" v-bind="$attrs" v-on="$listeners" />
</template>

<script>
/*
  <num-input
    v-else-if="itemDesc.type === 'num'"
    :point="2"
    placeholder="请输入数量"
    v-model.number="$attrs.value"
  ></num-input>*/
import DocSelect from './docSelect'
import EbaSelect from './ebaSelect'
import DictSelect from './dictSelect'
import SqPriceSelect from './sqPriceSelect'

//import NumInput from './input/numInput'
export default {
  name: 'ErpInput',
  components: {
    DocSelect,
    EbaSelect,
    DictSelect,
    SqPriceSelect
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
    }
  },
  methods: {
    focus() {
      if ('focus' in this.$children[0]) {
        this.$children[0].focus()
      }
    },
    onInput(e) {
      console.log('input', e, this.$attrs.value)
      this.$attrs.value = e
      this.$emit('input', e)
    }
  }
}
</script>

<style>
</style>