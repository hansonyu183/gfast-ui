<template>
  <el-form v-if="desc" ref="qyeryForm" label-width="80px" :model="value" :inline="true">
    <el-form-item
      v-for="item in desc.items"
      :key="item.name"
      :prop="item.name"
      :label="item.label"
    >
      <erp-input v-if="value" v-bind="item.attrs" :itemDesc="item" v-model="value[item.name]" />
    </el-form-item>
    <el-button icon="el-icon-refresh" @click="handleReset">重置</el-button>
  </el-form>
</template>

<script>
import ErpInput from './input/erpInput'
import MxForm from './minxis/mxForm'

export default {
  name: 'QueryForm',
  components: { ErpInput },
  mixins: [MxForm],
  props: {},
  data() {
    return {}
  },

  methods: {
    /** 搜索按钮操作 */
    handleSubmit() {
      this.$emit('submit', this.value)
    },
    handleReset() {
      this.resetForm('qyeryForm')
      this.$emit('reset')
    }
  }
}
</script>
<style>
</style>