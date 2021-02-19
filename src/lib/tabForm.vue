<template>
  <div>
    <el-tabs v-if="desc.length > 1" v-model="activeName">
      <el-tab-pane v-for="(v, i) in desc" :key="i" :label="v.label" :name="v.name"> </el-tab-pane>
    </el-tabs>
    <div v-for="(v, i) in desc" :key="i">
      <erp-form
        v-if="value"
        v-show="activeName"
        :readOnly="readOnly"
        :desc="v"
        v-model="value[v.name]"
      />
    </div>
  </div>
</template>

<script>
/*
    <el-button type="primary" icon="el-icon-search" @click="handleSubmit">{{
      primaryLabel
    }}</el-button>
    <el-button icon="el-icon-refresh" @click="handleReset">重置</el-button>

*/
import ErpForm from './erpForm'
export default {
  name: 'TabForm',
  components: { ErpForm },
  props: {
    desc: {
      type: Array,
      request: true,
      default: [
        {
          name: 'form1',
          label: 'form1'
        }
      ]
    },
    value: {
      type: Object,
      request: true
    },
    readOnly: {
      type: Boolean,
      default: false
    },
    type: 'search'
  },
  data() {
    return {
      activeName: this.desc[0]?.name ?? '0'
    }
  },
  computed: {
    primaryLabel() {
      return this.type === 'search' ? '搜索' : '保存'
    }
  },
  watch: {},
  methods: {
    setDefaultValue() {
      const formData = { ...this.value }
      // 设置默认值
      for (const el of this.desc) {
        if (formData[el.name] === undefined || formData[el.name] === null) {
          formData[el.name] = undefined
        }
      }
      this.$emit('input', formData)
    },
    refreshForm() {
      this.resetForm('form')
    },
    /** 搜索按钮操作 */
    handleSubmit() {
      this.$emit('submit', this.value)
    },
    handleReset() {
      this.resetForm('form')
      this.$emit('reset')
    }
  },
  created() {},
  mounted() {
    this.setDefaultValue()
  }
}
</script>
<style>
</style>