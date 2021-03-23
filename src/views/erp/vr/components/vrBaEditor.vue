<template>
  <el-form
    v-if="model"
    :model="model"
    ref="editorForm"
    id="print"
    label-width="80px"
    :inline="true"
  >
    <vr-act
      v-if="model.vr"
      v-bind="$attrs"
      v-on="$listeners"
      :id.sync="model.vr.id"
      :nextId="model.nextId"
      :preId="model.preId"
      :stateId="stateId"
      :dataType="model.type"
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
          :disabled="readOnly"
          v-model.lazy="model.vr[item.name]"
        />
      </el-form-item>
    </vr-act>
    <div v-if="model.vrMain">
      <el-form-item
        v-for="item in desc.vrMain.items"
        :key="item.name"
        :prop="`vrMain.${item.name}`"
        :label="item.label"
        :show-message="true"
        v-model="model.vrMain[item.name]"
      >
        <erp-input
          :class="`vr_main_${item.name}`"
          :itemDesc="item"
          :disabled="readOnly"
          v-model="model.vrMain[item.name]"
        />
      </el-form-item>
    </div>
    <res-table
      v-if="model.vrNum && model.vrMain && model.vrMain.eba_id"
      class="vr-num"
      ref="vrNum"
      mainProp="vrNum"
      expandProp="vrPf"
      show-summary
      :formRules="rules"
      :desc="desc.vrNum"
      v-model="model.vrNum"
      :readOnly="readOnly"
    >
    </res-table>
    <!--


  -->
  </el-form>
</template>

<script>
import { mapGetters } from 'vuex'

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
    server: {},
    desc: {},
    type: ''
  },
  data() {
    return {
      model: {}
    }
  },
  computed: {
    ...mapGetters({
      stateStore: 'state'
      // ...
    }),
    mainForm: {
      get() {
        return this.model.vr
      },
      set(newVal) {
        this.model.vr = newVal
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
      return this.model?.vr?.id ?? 0
    }
  },
  watch: {
    id: {
      async handler(val, oldVal) {
        let { code, msg, model } = await this.server.createModel(this.type, val)
        if (code === 200) {          
          this.model = model
          if (msg && msg !== '') {
            this.msgSuccess(msg)
          }
        } else {
          this.msgError(msg)
        }
      },
      immediate: true
    },
    readOnly: {
      handler(val) {
        this.model.readOnly = val
      }
    }
  },
  methods: {},
  mounted() {}
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