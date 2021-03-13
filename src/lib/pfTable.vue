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
    v-bind="$attrs"
    v-on="$listeners"
  >
    <el-table-column
      :class="`col_${desc.name}_${item.name}`"
      v-for="(item, colIndex) in desc.items"
      :key="'col_' + item.name"
      :prop="item.name"
      :label="item.label"
    >
      <template v-slot="scope" >
        <el-form-item :prop="`vrPf[${getPropIndex(scope.row)}].${item.name}`" :rules="formRules[item.type]">
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
import ErpInput from './input/erpInput.vue'
import MxTable from './minxis/mxTable'
import { BigNumber } from 'bignumber.js'

export default {
  name: 'PfTable',
  components: { ErpInput },
  mixins: [MxTable],

  props: {},
  data() {
    return {}
  },
  watch: {
    main: {
      handler(newVal) {
        for (const item of this.tableData) {
          item.num = new BigNumber(item.per_pack_num).times(newVal.pack_num).toNumber()
          item.amo = new BigNumber(item.price).times(item.num).toNumber()
        }
      },
      deep: true
    }
  },
  computed: {
    tableData: {
      get() {
        return this.value?.filter((pItem) => {
          return pItem.iid === this.main.id
        })
      },
      set(val) {}
    },

    sum: {
      get: function () {
        BigNumber.config({ DECIMAL_PLACES: 4 })
        let amo = new BigNumber(0)
        let perPackNum = new BigNumber(0)
        let num = new BigNumber(0)
        for (const item of this.tableData) {
          amo = amo.plus(item.amo)
          num = num.plus(item.num)
          perPackNum = perPackNum.plus(item.per_pack_num)
        }
        return {
          amo: amo.toNumber(),
          num: num.toNumber(),
          perPackNum: perPackNum.toNumber(),
          price: amo.div(num).toNumber()
        }
      }
    }
  },
  methods: {
    getPropIndex(row) {
      const idx = this.value.findIndex((obj) => obj.id === row.id && obj.iid === row.iid)
      return idx
    },
    changeMain() {
      BigNumber.config({ DECIMAL_PLACES: 4 })
      let amo = new BigNumber(0)
      let perPackNum = new BigNumber(0)
      let num = new BigNumber(0)
      for (const item of this.tableData) {
        amo = amo.plus(item.amo)
        num = num.plus(item.num)
        perPackNum = perPackNum.plus(item.per_pack_num)
      }
      this.main.per_pack_num = perPackNum.toNumber()
      this.main.price = amo.div(num).toNumber()
      this.main.num = num.toNumber()
      this.main.amo = amo.toNumber()
    },
    addRow() {
      let newRow = {}
      for (const item of this.desc.items) {
        newRow[item.name] = null
      }
      let maxId = this.tableData.reduce(function (pre, cur) {
        return Math.max(cur.id, pre)
      }, 0)
      newRow['id'] = maxId + 1
      newRow['iid'] = this.main.id
      this.value.push(newRow)
    },
    delRow(idx, row) {
      if (this.tableData.length > 1) {
        const index = this.value.findIndex((obj) => obj.id === row.id && obj.iid === row.iid)
        this.value.splice(index, 1)
        this.changeMain()
      }
    },
    onCellChange(e) {
      switch (e.column.property) {
        case 'per_pack_num':
          e.row.num = new BigNumber(this.main.pack_num).times(e.row.per_pack_num).toNumber()
          e.row.amo = new BigNumber(e.row.price).times(e.row.num).toNumber()
          this.changeMain()
          break
        case 'num':
          e.row.per_pack_num = new BigNumber(e.row.num).div(this.main.pack_num).toNumber()
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
        default:
          break
      }
      this.$emit('cellChange', e, this.desc.name)
    }
  }
}
</script>

<style scoped>
.tb-input >>> .el-input__inner {
  border: none;
}
</style>