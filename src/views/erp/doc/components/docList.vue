<template>
  <div class="app-container">
    <query-form v-if="descForm" :desc="descForm" v-model="form" />
    <erp-List
      v-if="descList && list"
      :ref="dataType + 'List'"
      :desc="descList"
      :value="list"
      :filters="form"
      @row-dblclick="onRowDbClick"
    />
    <el-dialog v-if="dbClickId" title="资料编辑" width="80%" :visible.sync="ediorVisible">
      <doc-editor
        :dataType="dataType"
        :pageName="dataType + 'Editor'"
        :desc="descEditor"
        :dataId="dbClickId"
      >
        ></doc-editor
      >
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import docApi from '@/api/erp/doc'
import ErpList from '@/lib/erpList.vue'
import QueryForm from '@/lib/queryForm.vue'
import DocEditor from './docEditor.vue'
export default {
  name: 'DocList',
  components: {
    QueryForm,
    ErpList,
    DocEditor
  },
  props: {
    dataType: '',
    pageName: '',
    pageDesc: {}
  },
  data() {
    return {
      descForm: this.pageDesc.form,
      descList: this.pageDesc.tables[0],
      descEditor: this.pageDesc.editor,
      // 遮罩层
      loading: true,
      list: undefined,
      //form数据
      form: {
        // 页面参数
      },
      // 是否显示弹出层
      dbClickId: 0,
      ediorVisible: false
    }
  },
  computed: {
    // 使用对象展开运算符将 getter 混入 computed 对象中
    ...mapGetters([
      'getPageDesc',
      'getPageDescByValue'

      // ...
    ])
  },
  watch: {
  },
  created() {
    this.loading = true
    this.getData()
    this.loading = false
  },
  mounted() {},
  methods: {

    initDesc() {
      const desc = this.getPageDesc(this.pageName)
      if (desc?.forms) {
        this.descForm = desc.forms[0]
      }
      if (desc?.tables) {
        this.descList = desc.tables[0]
      }
    },
    /** 查询明细数据 */
    getData() {
      docApi.getList(this.dataType).then((response) => {
        this.list = response.data.tables[this.dataType]
      })
    },

    /** 双击打开编辑弹窗 */
    onRowDbClick(row, col, evt) {
      this.dbClickId = row.id
      this.ediorVisible = true
    },
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