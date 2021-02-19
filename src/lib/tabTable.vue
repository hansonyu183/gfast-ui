<template>
  <el-tabs v-model="activeName">
    <el-tab-pane v-for="t in desc" :key="t.name" :label="t.label" :name="t.name">
      <erp-table
        :readOnly="readOnly"
        :desc="t"
        :value="value[t.name]"
        @row-dblclick="onRowDbClick(...arguments, t.name)"
      >
      </erp-table>
    </el-tab-pane>
  </el-tabs>
</template>
<script>
import ErpTable from './erpTable'
export default {
  name: 'TabTable',
  components: { ErpTable },
  props: {
    desc: {
      type: Array,
      default: [
        {
          name: 'table1',
          label: 'table1'
        }
      ]
    },
    value: {
      type: Object
    },
    readOnly: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      activeName: ''
    }
  },
  created() {
    for (const key in this.value) {
      if (Object.hasOwnProperty.call(this.value, key)) {
        const element = this.value[key]
        if (element?.length > 0) {
          this.activeName = key
          return
        }
      }
    }
  },
  computed: {},
  watch: {},
  methods: {
    onRowDbClick(row, col, evt, tbName) {
      this.$emit('row-dbclick', row, col, evt, tbName)
      //this.ediorVisible = true
    }
  }
}
</script>

<style>
</style>