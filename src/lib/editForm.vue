<template>
  <el-form ref="editform" label-width="80px" v-bind="$attrs" :model="value" :inline="true">
    <el-form-item
      v-for="item in desc.items"
      :key="item.name"
      :prop="item.name"
      :label="item.label"
      :show-message="true"
      :rules="rules[item.type]"
    >
      <erp-input
        v-if="value"
        :class="`${desc.name}_${item.name}`"
        :disabled="readOnly"
        :itemDesc="item"
        v-model="value[item.name]"
      />
    </el-form-item>
  </el-form>
</template>

<script>
import ErpInput from './input/erpInput'
import MxForm from './minxis/mxForm'
export default {
  name: 'EditForm',
  components: { ErpInput },
  mixins: [MxForm],
  props: {
    readOnly: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      valid: function () {
        let pass = false
        this.$refs['editform'].validate((valid) => {
          pass = valid
        })
        return pass
      },
      rules: {
        name: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
        no: [{ required: true, message: '编号不能为空', trigger: 'blur' }],
        unum: [
          { pattern: /^(0\.?\d{0,2}|[1-9]\d*\.?\d{0,2})$/, message: '必须为正数', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {

  }
}
</script>
<style>
</style>