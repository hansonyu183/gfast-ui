<template>
  <div class="app-container">
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
      ref="form"
      v-if="desc ? desc.form : false"
      :desc="desc.form"
      v-model="form"
      :readOnly="readOnly"
    />
    <tab-table
      v-if="desc ? desc.tables : false"
      :desc="desc.tables"
      :value="tables"
      :readOnly="readOnly"
    >
    </tab-table>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getDoc, saveDoc, delDoc, docAction } from '@/api/erp/doc'
import PY from '@/utils/c2py.js'

import TabTable from '@/lib/tabTable.vue'
import EditForm from '@/lib/editForm.vue'
import DocAct from '@/lib/docAct.vue'
export default {
  name: 'DocEditor',
  components: {
    EditForm,
    TabTable,
    DocAct
  },
  props: {
    desc: {},
    dataType: '',
    dataId: 0
  },
  data() {
    return {
      //  desc: undefined,
      //form数据
      form: {},
      //table数据
      tables: {},
      id: this.dataId,
      nextId: 0,
      preId: 0
    }
  },
  computed: {
    ...mapGetters({
      stateStore: 'state'
      // ...
    }),
    stateId: {
      get: function () {
        return this.form?.state_id ?? 0
      }
    },
    readOnly: {
      // getter
      get: function () {
        return 1 === this.stateStore.find((obj) => obj.id === this.stateId)?.read_only
      }
    },
    name: {
      get: function () {
        return this.form?.name
      }
    }
  },
  watch: {
    dataId: {
      handler(nval) {
        this.id = nval
      }
    },
    id: {
      handler() {
        this.getData()
      },
      immediate: true
    },
    name: {
      handler(newVal) {
        if (!this.readOnly) {
          this.form.py = PY.chineseToPinYin(newVal)
        }
      }
    }
  },
  created() {
    this.getData()
  },
  mounted() {},
  methods: {
    /** 查询明细数据 */
    getData() {
      getDoc(this.dataType, this.id).then((response) => {
        this.nextId = response.data.nextId
        this.preId = response.data.preId
        this.form = response.data.form
        this.tables = response.data.tables
      })
    },
    saveData() {
      saveDoc(this.dataType, this.id, { form: this.form, tables: this.tables }).then((response) => {
        if (response.code === 200) {
          this.id = response.data
          this.msgSuccess('保存成功')
          this.getData()
        } else {
          this.msgError(response.msg)
        }
      })
    },
    delData() {
      delDoc(this.dataType, this.id).then((response) => {
        if (response.code === 200) {
          this.msgSuccess('删除成功')
        } else {
          this.msgError(response.msg)
        }
      })
    },
    docAction(act) {
      docAction(this.dataType, this.id, act, { form: this.form, tables: this.tables }).then(
        (response) => {
          if (response.code === 200) {
            this.id = response.data
            this.msgSuccess('操作成功')
            this.getData()
          } else {
            this.msgError(response.msg)
          }
        }
      )
    },
    onAction(act) {
      switch (act) {
        case 'add':
          this.getData()
          break
        case 'pre':
          this.getData()
          break
        case 'next':
          this.getData()
          break
        case 'print':
          break
        case 'save':
          if (this.$refs.form.valid()) {
            this.docAction(act)
          } else {
            this.msgError('数据有误，请核查！')
          }
          break
        default:
          this.docAction(act)
          break
      }
    }
  }
}
</script>

<style>
/* el-divider 修改高度&虚线效果 */
.el-divider--horizontal {
  margin: 8px 0;
  background: 0 0;
  border-top: 1px dashed #e8eaec;
}
</style>