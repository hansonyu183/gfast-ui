<template>
  <el-tabs v-model="activeName">
    <el-tab-pane v-for="t in desc" :key="t.name" :label="t.label" :name="t.name">
      <erp-table
        :readOnly="readOnly"
        :desc="t"
        v-model="value[t.name]"
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
      type: Array
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
  created() {},
  computed: {},
  watch: {
    value: {
      handler() {
        if (this.value) {
          this.activeName = Object.keys(this.value)[0]
        }
        // deep: true // 如果是对象要深度监听
      },
      immediate: true
    }
  },
  methods: {
    onRowDbClick(row, col, evt, tbName) {
      this.$emit('row-dbclick', row, col, evt, tbName)
      //this.ediorVisible = true
    }
  },
  mounted() {}
}
</script>

<style>
</style>