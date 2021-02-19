<template>
  <el-form ref="erpform" label-width="80px" :model="value" :inline="true">
    <el-form-item
      v-for="item in items"
      :key="item.name"
      :prop="item.name"
      :label="item.label"
      label-width="auto"
    >
      <erp-input
        v-if="value"
        :disabled="readOnly"
        v-bind="item.attrs"
        :itemDesc="item"
        v-model="value[item.name]"
      />
    </el-form-item>
  </el-form>
</template>

<script>
/*
      <erp-label
       style="border-bottom: 1px solid #0081EF;min-width:50px;"
        v-if="value && readOnly"
        v-bind="item.attrs"
        :value="value[item.name]"
        :itemDesc="item"
      />
*/
import ErpInput from './erpInput'
import ErpLabel from './erpLabel'
export default {
  name: 'ErpForm',
  components: { ErpInput, ErpLabel },
  props: {
    desc: {
      type: Object,
      request: true,
      default: [
        {
          name: 'form',
          label: 'form'
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