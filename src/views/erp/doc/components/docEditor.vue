<template>
  <div class="app-container">
    <doc-act v-bind="$attrs" v-on="$listeners" @action="onAction" />
    <tab-form v-if="desc.forms" :desc="desc.forms" v-model="forms" :readOnly="readOnly" />
    <tab-table
      v-if="desc.tables"
      ref="erpTable"
      :desc="desc.tables"
      :value="tables"
      :readOnly="readOnly"
    >
    </tab-table>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getDoc } from '@/api/erp/doc'
import TabTable from '@/lib/tabTable.vue'
import TabForm from '@/lib/tabForm.vue'
import DocAct from '@/lib/docAct.vue'
export default {
  name: 'DocEditor',
  components: {
    TabForm,
    TabTable,
    DocAct
  },
  props: {
    pageName: '',
    docName: '',
    docId: 0
  },
  data() {
    return {
      desc: {},
      // 遮罩层
      loading: true,
      //form数据
      forms: {},
      //table数据
      tables: {},
      dId: this.docId,
    }
  },
  computed: {
    // 使用对象展开运算符将 getter 混入 computed 对象中
    ...mapGetters([
      'getPageDescByValue',
      'dState'
      // ...
    ]),
    readOnly() {
      const sid = this.forms[this.docName]?.dstate_id
      return 1 === this.dState.find((obj) => obj.id == sid)?.read_only
    },
  },
  watch: {},
  created() {
    this.loading = true
    this.getData(this.docId)
    //this.initForm()
    this.loading = false
  },
  mounted() {},
  methods: {
    /** 初始化Form和表格*/
    initForm() {
      this.desc = this.getPageDesc(this.pageName)
      for (const k in this.desc.forms) {
        //this.formData[k.name] = undefined
      }
    },
    /** 查询明细数据 */
    getData(docId) {
      getDoc(this.docName, docId).then((response) => {
        this.forms = response.data.forms
        this.tables = response.data.tables
        const pageData = {
          name: this.pageName,
          forms: response.data.forms,
          tables: response.data.tables
        }
        this.desc = this.getPageDescByValue(this.pageName, pageData)
        this.$store.dispatch('desc/saveUserPageDesc', this.desc)
      })
    },

    onAction(act, docId) {
      // this.vouState = 'f'
      switch (act) {
        case 'pre':
          this.dId = docId
          this.getData(docId)
          break
        case 'next':
          this.dId = docId
          this.getData(docId)
          break
        case 'add':
          this.dId = docId
          for (const key in this.tables) {
            this.tables[key] = []
          }
          for (const key in this.forms) {
            this.forms[key] = {}
          }
          break
        default:
          break
      }
    },
    /** 刷新明细页 */
    refreshPage() {
      this.loading = true
      // this.getData()
      this.loading = false
    },
    /** 刷新表格 */
    refreshTable() {
      this.pageNum = 1
      this.getData()
    },
    /** 搜索按钮操作 */
    handleSubmit(value) {
      this.loading = true
      this.formData = value
      this.refreshTable()
      this.loading = false
    },
    handleReset() {
      //this.$refs.erpForm.refreshForm()
      this.handleSubmit()
    },
    /** 双击打开编辑弹窗 */
    handleVouClose() {
      this.vouVisible = false
      this.loading = true
      this.refreshTable()
      this.loading = false
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