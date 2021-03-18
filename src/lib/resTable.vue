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
    show-summary
    :summary-method="getSummaries"
    v-on="$listeners"
  >
    <el-table-column v-if="hasPf" type="expand">
      <template slot-scope="scope">
        <pf-table
          v-if="scope.row"
          class="vr-pf"
          :ref="`vrPf${scope.row.id}`"
          row-key="id"
          :desc="desc.vrPf"
          :main="scope.row"
          :formRules="formRules"
          v-model="pf"
          :readOnly="readOnly"
          @cellChange="onPfCellChange"
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
          :key="`vrNum[${scope.$index}].${item.name}`"
          :prop="`vrNum[${scope.$index}].${item.name}`"
          :rules="formRules[item.type]"
        >
          <erp-input
            class="tb-input"
            :itemDesc="item"
            :disabled="item.readOnly ? item.readOnly && readOnly : readOnly"
            v-model="scope.row[scope.column.property]"
            @keyup.ctrl.native="onKeyUp($event, colIndex, scope.$index, scope.row)"
            @change="onCellChange(scope)"
          />
        </el-form-item>
      </template>
    </el-table-column>
  </el-table>
</template>
<script>
/*
 */
import ErpInput from './input/erpInput.vue'
import MxTable from './minxis/mxTable.vue'
import PfTable from './pfTable.vue'
import { BigNumber } from 'bignumber.js'
import { mapGetters } from 'vuex'

export default {
  name: 'ResTable',
  components: { ErpInput, PfTable },
  mixins: [MxTable],
  props: {
    pf: {
      type: Array
    },
    hasPf: false,
    ebaID:0,
  },
  data() {
    return {}
  },
  watch: {},

  computed: {
    ...mapGetters({
      getOpt: 'getOpt'
      // ...
    }),
    resList: {
      get() {
        return this.getOpt('res')
      }
    },
    ebaBomList: {
      get() {
        return this.getOpt('eba_bom').find((obj) => obj.eba_id === this.ebaID)
      }
    },
    sum: {
      get: function () {
        BigNumber.config({ DECIMAL_PLACES: 4 })
        let amo = new BigNumber(0)
        let packNum = new BigNumber(0)
        let num = new BigNumber(0)
        for (const item of this.tableData) {
          amo = amo.plus(item.amo)
          num = num.plus(item.num)
          packNum = packNum.plus(item.pack_num)
        }
        return {
          amo: amo.toNumber(),
          num: num.toNumber(),
          packNum: packNum.toNumber()
        }
      }
    }
  },
  methods: {
    changeMain() {
      this.main.print_pack_num = this.sum.packNum
      this.main.print_amo = this.sum.amo
      this.main.amo = this.sum.amo
    },

    delRow(index, row) {
      if (this.tableData.length > 1) {
        for (var i = 0; i < this.pf.length; i++) {
          if (this.pf[i].iid === row.id) {
            this.pf.splice(i, 1)
            i--
          }
        }
        this.tableData.splice(index, 1)
        this.changeMain()
      }
    },
    onCellChange(e) {
      switch (e.column.property) {
        case 'pack_num':
          e.row.num = new BigNumber(e.row.pack_num).times(e.row.per_pack_num).toNumber()
          e.row.amo = new BigNumber(e.row.price).times(e.row.num).toNumber()
          this.changeMain()
          break
        case 'per_pack_num':
          e.row.num = new BigNumber(e.row.pack_num).times(e.row.per_pack_num).toNumber()
          e.row.amo = new BigNumber(e.row.price).times(e.row.num).toNumber()
          this.changeMain()
          break
        case 'num':
          e.row.per_pack_num = new BigNumber(e.row.num).div(e.row.pack_num).toNumber()
          e.row.amo = new BigNumber(e.row.price).times(e.row.num).toNumber()
          this.changeMain()
          break
        case 'price':
          e.row.amo = new BigNumber(e.row.price).times(e.row.num).toNumber()
          this.changeMain()
          break
        case 'amo':
          e.row.price = new BigNumber(e.row.amo).div(e.row.num).toNumber()
          this.changeMain()
          break
        case 'res_id':
          const res = this.resList.find((obj) => obj.id === e.row.res_id)
          e.row.print_res = res.name
          e.row.print_model = res.model
          e.row.per_pack_num = res.pack_num
          if (res.reskind_id=2) {
            
          } else {
            
          }
          break
        default:
          break
      }
    },
    onPfCellChange() {
      this.changeMain()
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