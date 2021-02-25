<template>
  <el-form ref="editform" label-width="80px" :model="value" :inline="true">
    <el-form-item
      v-for="item in items"
      :key="item.name"
      :prop="item.name"
      :label="item.label"
      :show-message="true"
      :rules="rules[item.type]"
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
import ErpInput from './erpInput'
export default {
  name: 'EditForm',
  components: { ErpInput },
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
    },
    readOnly: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      items: this.desc?.items ? [...this.desc.items] : [],
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
        ],
      }
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
  validateForm() {
    let pass = false
    this.$refs['editform'].validate((valid) => {
      pass = valid
    })
    return pass
  },
  created() {},
  mounted() {
    //this.setDefaultValue()
  }
}
</script>
<style>
</style>