<template>
  <div>
    <el-row v-if="!readOnly" type="flex" class="row-bg" justify="space-between">
      <el-col>
        <el-tooltip class="item" effect="dark" content="新增" placement="top-start">
          <el-button type="primary" icon="el-icon-plus" @click="addRow"></el-button>
        </el-tooltip>
      </el-col>
    </el-row>
    <el-table
      v-if="desc.items"
      max-height="600"
      fit
      border
      row-key="id"
      align="left"
      :data="tableData"
      v-bind="$attrs"
      v-on="$listeners"
    >
      <el-table-column
        v-for="item in desc.items"
        :key="'col_' + item.name"
        :prop="item.name"
        :label="item.label"
      >
        <template v-slot="scope">
          <erp-input
            v-if="tableData"
            :itemDesc="item"
            v-model="scope.row[scope.column.property]"
            :disabled="item.readOnly ? item.readOnly && readOnly : readOnly"
          />
        </template>
      </el-table-column>
      <el-table-column v-if="!readOnly" fixed="right" label="操作" width="120">
        <template slot-scope="scope">
          <el-button
            @click.native.prevent="delRow(scope.$index, tableData)"
            type="text"
            size="small"
          >
            移除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import ErpInput from './erpInput.vue'
export default {
  name: 'ErpTable',
  components: { ErpInput },
  props: {
    desc: {
      type: Object
    },
    value: {
      type: Array,
      default: function () {
        return []
      }
    },
    readOnly: false
  },
  data() {
    return {
      /*
      tableData: [
        {
          type: Array,
          default: function () {
            return []
          }
        }
      ]*/
    }
  },
  watch: {
    /* value: {
      handler(newVal) {
        if (newVal) {
          this.tableData = newVal
        } else {
          this.tableData = []
        }
        console.log(this.tableData !== null)
      },
      immediate: true
    },*/
    tableData: {
      handler(newVal) {
        this.$emit('input', newVal)
      }
    }
  },
  computed: {
    tableData: {
      get: function () {
        return this.value ?? []
      }
    }
  },
  methods: {
    addRow() {
      let newRow = {}
      for (const val of this.desc.items) {
        newRow[val.name] = null
      }
      this.tableData.push(newRow)
    },
    delRow(index, rows) {
      rows.splice(index, 1)
    }
  }
}
</script>

<style>
</style>