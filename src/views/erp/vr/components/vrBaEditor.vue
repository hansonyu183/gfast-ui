<template>
  <el-form :model="data" ref="editorForm" id="print" label-width="80px" :inline="true">
    <vr-act
      v-bind="$attrs"
      v-on="$listeners"
      @action="onAction"
      :id.sync="id"
      :nextId="nextId"
      :preId="preId"
      :stateId="stateId"
      :dataType="dataType"
    >
      <el-form-item
        v-for="item in desc.vr.items"
        :key="item.name"
        :prop="`vr.${item.name}`"
        :label="item.label"
        :show-message="true"
        :rules="rules[item.type]"
      >
        <erp-input
          :class="`vr_${item.name}`"
          :disabled="readOnly"
          :itemDesc="item"
          v-model="data.vr[item.name]"
        />
      </el-form-item>
    </vr-act>
    <el-form-item
      v-for="item in desc.vrMain.items"
      :key="item.name"
      :prop="`vrMain.${item.name}`"
      :label="item.label"
      :show-message="true"
      :rules="rules[item.type]"
    >
      <erp-input
        :class="`vr_main_${item.name}`"
        :disabled="readOnly"
        :itemDesc="item"
        v-model="data.vrMain[item.name]"
      />
    </el-form-item>
    <el-input class="sys_user" :placeholder="sysUser.name" :disabled="true" />
    <res-table
      class="vr-num"
      ref="vrNum"
      :formRules="rules"
      :desc="desc.vrNum"
      v-model="data.vrNum"
      :main="data.vrMain"
      :hasPf="true"
      :pf="data.vrPf"
      :readOnly="readOnly"
    >
    </res-table>
  </el-form>
</template>

<script>
import { BigNumber } from 'bignumber.js'
import { mapGetters } from 'vuex'
import * as erp from '@/utils/erp.js'

import vrApi from '@/api/erp/vr'

import MxEditor from '@/lib/minxis/mxEditor.vue'
import ResTable from '@/lib/resTable.vue'
import ErpInput from '@/lib/input/erpInput.vue'
import VrAct from '@/lib/vrAct.vue'
export default {
  name: 'VrBaEditor',
  components: {
    ResTable,
    VrAct,
    ErpInput
  },
  mixins: [MxEditor],

  props: {},
  data() {
    return {
      api: vrApi,
      showUser: false,
      data: {
        nextID: 0,
        preID: 0,
        vr: {},
        vrMain: {},
        vrNum: [],
        vrPf: []
      }
    }
  },
  computed: {
    ...mapGetters({
      sysUser: 'sysUser',
      getOptField: 'getOptField',
      getOptLabel: 'getOptLabel'
      // ...
    }),
    mainForm: {
      get: function () {
        return this.data.vr
      },
      set: function (newVal) {
        this.data.vr = newVal
      }
    },
    ebaId: {
      get() {
        return this.data.vrMain?.eba_id
      },
      set(val) {
        this.data.vrMain.eba_id = val
      }
    },
    vrDate: {
      get() {
        return this.data.vr?.date
      }
    }
  },
  watch: {
    ebaId: {
      handler(val) {
        if (!this.readOnly) {
          this.data.vrMain.emp_id = this.getOptField('eba', 'emp_id', val)
          const ebaNote = this.getOptField('eba', 'note', val)
          if (ebaNote) {
            this.msgInfo(ebaNote)
          }
        }
      }
      // immediate: true
    },
    vrDate: {
      handler(val) {
        if (val && !this.readOnly) {
          let date = new Date()
          date.setDate(erp.getDateByStr(val).getDate() + 1)
          this.data.vrMain.tran_date = erp.formatDate(date, 'yyyyMMdd')
        }
      }
      // immediate: true
    }
  },
  created() {},
  methods: {
    initNewData() {
      if (!this.data.vr) {
        let v = {}
        for (const item of this.desc.vr.items) {
          v[item.name] = null
        }
        this.data.vr = v
      }
      if (!this.data.vrMain) {
        let v = {}
        for (const item of this.desc.vrMain.items) {
          v[item.name] = null
        }
        this.data.vrMain = v
      }
      if (!this.data.vrNum) {
        let row = {}
        for (const item of this.desc.vrNum.items) {
          row[item.name] = null
        }
        row['id'] = 1
        this.data.vrNum = [row]
      }
      if (!this.data.vrPf) {
        this.data.vrPf = []
      }
    },
    getData() {
      this.api.getByID(this.dataType, this.id).then((response) => {
        if (response.code === 200) {
          this.nextId = response.data.nextID
          this.preId = response.data.preID
          this.data = response.data
          if (!this.readOnly) {
            this.initNewData()
          }
        } else {
          this.msgError(response.msg)
        }
      })
    },
    onInput(e) {
      console.log(e)
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