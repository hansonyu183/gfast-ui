<template>
  <div class="conter">
    <doc-act
      v-bind="$attrs"
      v-on="$listeners"
      @action="onAction"
      :id.sync="id"
      :nextId="nextId"
      :preId="preId"
      :stateId="stateId"
    />
    <edit-form
      :ref="this.dataType + 'Form'"
      v-if="desc ? desc.form : false"
      :desc="desc.form"
      v-model="mainForm"
      :readOnly="readOnly"
    />
    <el-tabs v-model="activeName">
      <el-tab-pane v-for="t in desc.tables" :key="t.name" :label="t.label" :name="t.name">
        <erp-table
          :ref="`tb_${t.name}`"
          :showSave="true"
          :readOnly="readOnly"
          :desc="t"
          :data="value[t.name]"
          @saveTable="onSaveTable"
        >
        </erp-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import PY from '@/utils/c2py.js'
import docApi from '@/api/erp/doc'
import { deepTrimNull } from '@/utils/erp.js'

import MxEditor from '@/lib/minxis/mxEditor.vue'
import EditForm from '@/lib/editForm.vue'
import DocAct from '@/lib/docAct.vue'
export default {
  name: 'DocEditor',
  components: {
    EditForm,
    TabTable,
    DocAct
  },
  mixins: [MxEditor],
  props: {},
  data() {
    return {
      api: docApi,
      activeName: this.desc.tables[0]?.name
    }
  },
  computed: {
    valideRef: {
      get: function () {
        let refs = [this.dataType + 'Form']
        for (const item of this.desc.tables) {
          refs.push(`tb_${item.id}`)
        }
        return refs
      }
    },
    mainForm: {
      get: function () {
        return this.data.forms ? this.data.forms[this.dataType] : {}
      },
      set: function (newVal) {
        this.data.forms[this.dataType] = newVal
      }
    },
    nameVal: {
      get: function () {
        return this.mainForm?.name
      }
    }
  },
  watch: {
    nameVal: {
      handler(newVal) {
        if (!this.readOnly && newVal) {
          this.mainForm['py'] = PY.chineseToPinYin(newVal)
        }
      }
    }
  },
  methods: {
    onSaveTable() {
      let tbData = { tables: this.data.tables }
      deepTrimNull(tbData)
      this.api.saveSub(this.dataType, this.id, tbData).then((response) => {
        if (response.code === 200) {
          this.msgSuccess('保存成功')
        } else {
          this.msgError(response.msg)
        }
      })
    }
  }
}
</script>

<style>

</style>