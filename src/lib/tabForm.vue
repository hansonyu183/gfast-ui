<template>
  <div>
    <el-tabs v-if="desc.length > 1" v-model="activeName">
      <el-tab-pane v-for="(v, i) in desc" :key="i" :label="v.label" :name="v.name"> </el-tab-pane>
    </el-tabs>
    <div v-for="(v, i) in desc" :key="i">
      <edit-form
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
import EditForm from './editForm'
export default {
  name: 'TabForm',
  components: { EditForm },
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
      request: true,
      default: function () {
        let formsData = {}
        for (const el of this.desc) {
          if (!formsData[el.name]) {
            formsData[el.name] = {}
            for (const it of el.items) {
              formsData[el.name][it.name] = undefined
            }
          }
        }
        return formsData
      }
    },
    readOnly: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      activeName: this.desc[0]?.name ?? '0'
    }
  },
  computed: {},
  watch: {},
  methods: {
    setDefaultValue() {
      let formData = { ...this.value }
      // 设置默认值
      for (const el of this.desc) {
        if (!formData[el.name]) {
          formData[el.name] = {}
          for (const it of el.items) {
            formData[el.name][it] = 1
          }
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
    // this.setDefaultValue()
  }
}
</script>
<style>
</style>