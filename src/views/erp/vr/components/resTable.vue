<template>
  <el-table
    v-if="desc.items"
    :ref="`tb_${desc.name}`"
    :data="tableData"
    row-key="id"
    max-height="600"
    style="width: 100%; margin-bottom: 20px"
    fit
    border
    align="left"
    :summary-method="getSummaries"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <el-table-column v-if="expandProp" type="expand">
      <template slot-scope="scope">
        <res-table
          v-if="scope.row.vrPf"
          class="vr-pf"
          :ref="`vrPf${scope.row.id}`"
          row-key="id"
          :mainProp="`${mainProp}[${scope.$index}][${expandProp}]`"
          :desc="desc.vrPf"
          :formRules="formRules"
          v-model="scope.row.vrPf"
          :readOnly="readOnly"
        />
      </template>
    </el-table-column>
    <el-table-column
      :class="`col_${desc.name}_${item.name}`"
      v-for="(item, colIndex) in desc.items"
      :key="'col_' + item.name"
      :prop="item.name"
      :label="item.label"
    >
      <template v-slot="scope">
        <el-form-item
          :key="`${mainProp}[${scope.$index}].${item.name}`"
          :prop="`${mainProp}[${scope.$index}].${item.name}`"
          :rules="formRules[item.type]"
        >
          <erp-input
            class="tb-input"
            :itemDesc="item"
            :disabled="item.readOnly ? item.readOnly && readOnly : readOnly"
            v-model="scope.row[scope.column.property]"
            @keyup.ctrl.native="onKeyUp($event, colIndex, scope.$index, scope.row)"
          />
        </el-form-item>
      </template>
    </el-table-column>
  </el-table>
</template>
<script>
/*
     


 */
import ErpInput from '@/lib/input/erpInput.vue'
import MxTable from './mxTable.vue'
import { mapGetters } from 'vuex'

export default {
  name: 'ResTable',
  components: { ErpInput },
  mixins: [MxTable],
  props: {},
  data() {
    return {}
  },
  watch: {},

  computed: {
    ...mapGetters({
      getOpt: 'getOpt'
      // ...
    })
  },
  methods: {
    delRow(index, row) {
      if (this.tableData.length > 1) {
        this.tableData.splice(index, 1)
      }
    },
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计'
          return
        }
        if (!['pack_num', 'amo', 'num'].includes(column.property)) {
          return
        }
        const values = data.map((item) => Number(item[column.property]))
        if (!values.every((value) => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0)
          sums[index]
        } else {
          sums[index] = 'N/A'
        }
      })
      return sums
    }
  }
}
</script>

<style scoped>
.tb-input >>> .el-input__inner {
  border: none;
}
</style>