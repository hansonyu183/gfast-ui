<template>
  <div class="app-container">
    <div ref="baVr" id="print">
      <vr-act
        v-bind="$attrs"
        v-on="$listeners"
        @action="onAction"
        :id.sync="id"
        :nextId="nextId"
        :preId="preId"
        :stateId="stateId"
      >
        <edit-form
          ref="vr"
          :inline="true"
          v-if="desc ? desc.vr : false"
          :desc="desc.vr"
          v-model="data.vr"
          :readOnly="readOnly"
        />
      </vr-act>
      <edit-form
        ref="vrMain"
        v-if="desc ? desc.vrMain : false"
        :desc="desc.vrMain"
        v-model="data.vrMain"
        :readOnly="readOnly"
      />
      <el-input class="sys_user" :placeholder="sysUser.name" :disabled="true" />
      <erp-table
        class="vr-num"
        ref="vrNum"
        v-if="desc ? desc.vrNum : false"
        row-key="id"
        :desc="desc.vrNum"
        :data="data.vrNum"
        :readOnly="readOnly"
        @cellChange="onCellChange"
        show-summary
        :summary-method="getSummaries"
      >
      </erp-table>
    </div>
  </div>
</template>

<script>
/*

 <el-button @click="tmp(scope)" />
*/
import { BigNumber } from 'bignumber.js'
import { mapGetters } from 'vuex'
import vrApi from '@/api/erp/vr'
import MxEditor from '@/lib/minxis/mxEditor.vue'

import ErpTable from '@/lib/erpTable.vue'
import EditForm from '@/lib/editForm.vue'
import VrAct from '@/lib/vrAct.vue'
export default {
  name: 'VrNumEditor',
  components: {
    EditForm,
    ErpTable,
    VrAct
  },
  mixins: [MxEditor],

  props: {},
  data() {
    return {
      api: vrApi
    }
  },
  computed: {
    ...mapGetters({
      sysUser: 'sysUser',
      getOptField: 'getOptField',
      getOptLabel: 'getOptLabel'
      // ...
    }),
    valideRef: {
      get: function () {
        let refs = ['vr', 'vrMain', 'vrNum']
        return refs
      }
    },

    mainForm: {
      get: function () {
        return this.data.vr
      },
      set: function (newVal) {
        this.data.vr = newVal
      }
    },
    vrNum: {
      get: function () {
        if (this.data.vrNum === null) {
          this.data.vrNum = []
        }
        return this.data.vrNum
      }
    },
    vrNumSum: {
      get: function () {
        let amo = new BigNumber(0)
        let printPackNum = new BigNumber(0)
        for (const item of this.vrNum) {
          amo = amo.plus(item.amo)
          printPackNum = printPackNum.plus(item.pack_num)
        }
        const am = amo.toNumber()
        return { amo: am, printPackNum: printPackNum.toNumber(), printAmo: am }
      }
    }
  },
  watch: {
    vrNum: {
      handler(newVal) {
        if (!newVal || Object.prototype.toString.call(newVal) !== '[object Array]') {
          return
        }
        let amo = new BigNumber(0)
        let num = new BigNumber(0)
        let pack = new BigNumber(0)

        for (const item of newVal) {
          amo = amo.plus(item.amo ?? 0)
          num = num.plus(item.num ?? 0)
          pack = pack.plus(item.pack_num ?? 0)
        }
        if (this.data.vrMain && this.data.vrMain.hasOwnProperty('amo')) {
          this.data.vrMain.amo = amo.toNumber()
        }
        if (this.data.vrMain && this.data.vrMain.hasOwnProperty('print_amo')) {
          this.data.vrMain.print_amo = amo.toNumber()
        }
        if (this.data.vrMain && this.data.vrMain.hasOwnProperty('print_pack_num')) {
          this.data.vrMain.print_pack_num = pack.toNumber()
        }
      },
      deep: true
    }
  },

  methods: {
    onCellChange(scope, tb) {
      switch (tb) {
        case 'vr_num':
          this.numTbCellChange(scope)
          break
        default:
          break
      }
    },
    numTbCellChange(e) {
      switch (e.column.property) {
        case 'pack_num':
          e.row.num = new BigNumber(e.row.pack_num).times(e.row.per_pack_num).toNumber()
          e.row.amo = new BigNumber(e.row.price).times(e.row.num).toNumber()
          break
        case 'per_pack_num':
          e.row.num = new BigNumber(e.row.pack_num).times(e.row.per_pack_num).toNumber()
          e.row.amo = new BigNumber(e.row.price).times(e.row.num).toNumber()
          break
        case 'num':
          e.row.per_pack_num = new BigNumber(e.row.num).div(e.row.pack_num).toNumber()
          e.row.amo = new BigNumber(e.row.price).times(e.row.num).toNumber()
          break
        case 'price':
          e.row.amo = new BigNumber(e.row.price).times(e.row.num).toNumber()
          break
        case 'amo':
          e.row.price = new BigNumber(e.row.amo).div(e.row.num).toNumber()
          break
        case 'res_id':
          e.row.print_res = this.getOptLabel('res', e.row.res_id)
          e.row.print_model = this.getOptField('res', 'model', e.row.res_id)
          break
        default:
          break
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

<style>
/* el-divider 修改高度&虚线效果 
.el-divider--horizontal {
  margin: 8px 0;
  background: 0 0;
  border-top: 1px dashed #e8eaec;
}*/
.sys_user {
  position: fixed;

  top: -9999px;

  left: -9999px;
}
</style>