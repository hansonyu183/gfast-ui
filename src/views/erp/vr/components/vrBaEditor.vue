<template>
  <el-form :model="servMod" ref="editorForm" id="print" label-width="80px" :inline="true">
    <vr-act
      v-if="servMod.vr"
      v-bind="$attrs"
      v-on="$listeners"
      :id.sync="servMod.vr.id"
      :nextId="servMod.nextId"
      :preId="servMod.preId"
      :stateId="stateId"
      :dataType="servMod.type"
    >
      <el-form-item
        v-for="item in desc.vr.items"
        :key="item.name"
        :prop="`vr.${item.name}`"
        :label="item.label"
        :show-message="true"
      >
        <erp-input
          :class="`vr_${item.name}`"
          :itemDesc="item"
          v-model.lazy="servMod.vr[item.name]"
        />
      </el-form-item>
    </vr-act>
    <div v-if="servMod.vrMain">
      <el-form-item
        v-for="item in desc.vrMain.items"
        :key="item.name"
        :prop="`vrMain.${item.name}`"
        :label="item.label"
        :show-message="true"
        v-model.lazy="servMod.vrMain[item.name]"
      >
        <erp-input
          :class="`vr_main_${item.name}`"
          :itemDesc="item"
          v-model.lazy="servMod.vrMain[item.name]"
        />
      </el-form-item>
    </div>
    <res-table
      v-if="servMod.vrNum"
      class="vr-num"
      ref="vrNum"
      mainProp="vrNum"
      expandProp="vrPf"
      show-summary
      :formRules="rules"
      :desc="desc.vrNum"
      v-model.lazy="servMod.vrNum"
      :readOnly="readOnly"
    >
    </res-table>
    <!--


  -->
  </el-form>
</template>

<script>
import { mapGetters } from 'vuex'
import * as erp from '@/utils/erp.js'

import MxEditor from './mxEditor.vue'
import ResTable from './resTable'
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
  props: {
    serv: {},
    desc: {},
    type: ''
  },
  data() {
    return {
      servMod: {}
    }
  },
  computed: {
    ...mapGetters({
      stateStore: 'state'
      // ...
    }),
    mainForm: {
      get() {
        return this.servMod.vr
      },
      set(newVal) {
        this.servMod.vr = newVal
      }
    },
    stateId: {
      get() {
        return this.mainForm?.state_id ?? 0
      },
      set(newVal) {
        if (this.mainForm) {
          this.mainForm.state_id = newVal
        }
      }
    },
    readOnly: {
      // getter
      get() {
        return 1 === this.stateStore.find((obj) => obj.id === this.stateId)?.read_only
      }
    },
    id() {
      return this.servMod?.vr?.id ?? 0
    }
  },
  watch: {
    id: {
      async handler(val, oldVal) {
        if (oldVal===undefined)
        console.log('watchid', val, oldVal)
        let { code, msg, mod } = await this.serv.loadData(this.type, val)
        if (code === 200) {
          this.servMod = mod
          this.readOnly || this.readyDataForEdit()
          if (msg && msg !== '') {
            this.msgSuccess(msg)
          }
        } else {
          this.msgError(response.msg)
        }
      },
      immediate: true
    },
    readOnly: {
      handler(val) {
        if (!val) {
          this.readyDataForEdit()
        }
      }
    }
  },
  methods: {
    readyDataForEdit() {
      let mod = this.servMod
      const desc = this.desc
      for (const key in desc) {
        if (typeof desc[key] !== 'object') {
          continue
        }
        if (!mod[key] || Object.keys(mod[key]).length === 0) {
          const tp = Object.prototype.toString.call(mod[key])
          if (tp === '[object Object]') {
            desc[key].items.forEach((item) => {
              this.$set(mod[key], item.name, null)
            })
          } else if (tp === '[object Array]') {
            let obj = {}
            desc[key].items.forEach((item) => {
              obj[item.name] = null
            })
            obj.id = 1
            mod[key].push(obj)
          }
        }
      }

      console.log(this.servMod)
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