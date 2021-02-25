<template>
  <el-form v-if="desc" ref="qyeryForm" label-width="80px" :model="value" :inline="true">
    <el-form-item
      v-for="item in items"
      :key="item.name"
      :prop="item.name"
      :label="item.label"
      label-width="auto"
    >
      <erp-input v-if="value" v-bind="item.attrs" :itemDesc="item" v-model="value[item.name]" />
    </el-form-item>
    <el-button icon="el-icon-refresh" @click="handleReset">重置</el-button>
  </el-form>
</template>

<script>
import ErpInput from './erpInput'
import ErpLabel from './erpLabel'
export default {
  name: 'QueryForm',
  components: { ErpInput, ErpLabel },
  props: {
    desc: {
      type: Object,
      request: true,
      default: function () {
        return {
          name: 'form',
          label: 'form',
          items: []
        }
      }
    },
    value: {
      type: Object,
      request: true,
      default: function () {
        let formData = {}
        for (const key in this.desc) {
          if (Object.hasOwnProperty.call(this.desc, key)) {
            const el = this.desc[key]
            if (!formData[el.name]) {
              formData[el.name] = undefined
            }
          }
        }
        return formData
      }
    }
  },
  data() {
    return {
      items: this.desc?.items ? [...this.desc.items] : []
    }
  },
  computed: {},

  methods: {
    setDefaultValue() {
      const formData = { ...this.value }
      // 设置默认值
      for (const el of this.desc.items) {
        if (formData[el.name] === undefined || formData[el.name] === null) {
          formData[el.name] = undefined
        }
      }
      this.$emit('input', formData)
    },
    /** 搜索按钮操作 */
    handleSubmit() {
      this.$emit('submit', this.value)
    },
    handleReset() {
      this.resetForm('qyeryForm')
      this.$emit('reset')
    }
  },
  created() {},
  mounted() {
    //this.setDefaultValue()
  }
}
</script>
<style>
</style>