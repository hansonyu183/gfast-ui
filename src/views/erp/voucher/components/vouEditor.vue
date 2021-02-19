<template>
  <div class="app-container">
    <erp-act />
    <vou-form v-if="desc.forms" :desc="desc.forms" v-model="forms" />
    <tab-table
      v-if="desc.tables"
      ref="erpTable"
      :desc="desc.tables"
      :value="tables"
      :canEdit="false"
    >
    </tab-table>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getVou } from '@/api/erp/vou'
import TabTable from '@/lib/tabTable.vue'
import VouForm from '@/lib/vouForm.vue'
import ErpAct from '@/lib/erpAct.vue'
export default {
  name: 'VouEditor',
  components: {
    VouForm,
    TabTable,
    ErpAct
  },
  props: {
    vid: 0,
    pageName: ''
  },
  data() {
    return {
      desc: {},
      // 遮罩层
      loading: true,
      tables: {},
      //form数据
      forms: {
        // 页面参数
      },
      // 是否显示弹出层
      vouVisible: false
    }
  },
  computed: {
    // 使用对象展开运算符将 getter 混入 computed 对象中
    ...mapGetters([
      'getPageDescByValue'
      // ...
    ])
  },
  watch: {},
  created() {
    this.loading = true
    this.getData()
    //this.initForm()
    this.loading = false
  },
  mounted() {},
  methods: {
    /** 初始化Form和表格*/
    initForm() {
      this.desc = this.getPageDesc(this.pageName)
      for (const k in this.desc.forms) {
        this.formData[k.name] = undefined
      }
    },
    /** 查询明细数据 */
    getData() {
      getVou(this.vid).then((response) => {
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
    handleUpdate(index) {},
    handleDblclickTable(row, column) {},
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