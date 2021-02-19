<template>
<el-form  ref="form" label-width="80px" :model="value"  :inline="true">
    <erp-form-item
      v-for="(item,key) in formDef"
      :key="key"
      :itemProp="key"
      :item="item"
      :value="value[key]"
      @input="handleInput($event, key)" />
</el-form>
</template>

<script>
import ErpFormItem from './erpFormItem/erpFormItem.vue';

export default {
  name: "ErpForm",
  components: {
    ErpFormItem
  },
  props: {
    formKey:0,
    formDef: {
      type:Object,
      request:true
    },
    value: {
      type:Object,
      request:true
    }
  },
  watch:{
  },
  methods: {
    handleInput(val, key) {
    // 这里element-ui没有上报event，直接就是value了
    this.$emit('input', { ...this.value, [key]: val })
    },
    setDefaultValue() {
      const formData = { ...this.value }
      // 设置默认值

      for (const key in this.formDef) {
      //  if (Object.hasOwnProperty.call(object, key)) {
          if (formData[key] === undefined || formData[key] === null) {
            formData[key] = undefined
          }          
      //   }
      }
      this.$emit('input', formData)
    },
    refreshForm(){
      this.resetForm("form");
    }
  },
  mounted() {
    this.setDefaultValue()
  },
}
</script>
<style>

</style>