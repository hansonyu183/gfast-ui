<template>
  <div class="app-container">
    <erp-form 
      ref="erpForm"
      v-model="formData"
      :formDef="view.form"
    />
    <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
    <el-button icon="el-icon-refresh" size="mini" @click="handleReset">重置</el-button> 
    <el-table
      v-loading="loading"
      :data="tableData"
      :summary-method="getSummaries"
      height="600"
      show-summary
      stripe
      @row-dblclick="handleDblclickTable"
    >
     <el-table-column
        v-for="(v,i) in view.table"
        :key="i"
        :label="getErpTranslate(v)"
        :prop="v"
        :width=120
        :formatter="formatCell"
        show-overflow-tooltip=""
        align="center"
      />
       </el-table>
        <pagination class="grid-pagi"
          v-show="tableSum.count > 0"
          :total="tableSum.count"
          :page.sync="formData.pageNum"
          :limit.sync="formData.pageSize"
          @pagination="refreshPage"/>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getQueryData,getQuerySum} from "@/api/erp/query"
import ErpForm from '@/components/erp/erpForm.vue'
export default {
  name: "ErpQuery",
  components: {
    ErpForm
  },
  props: {
    queryName: {
      type:String,
      request:true
    },
    view:{
      type:Object,
      request:true
    }
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 表格数据
      tableData:[],
      page:0,
      //表格合计
      tableSum:{
        //总条数
        count:0
      },
      //form数据
      formData:{        
      // 页面参数
        pageNum: 1,
        pageSize: 10,
      },
      // 是否显示弹出层
      vouVisible: false,
    }
  },
  computed: {
  // 使用对象展开运算符将 getter 混入 computed 对象中
    ...mapGetters([
      'getErpInfoById',
      'getErpTranslate',
      // ...
    ]),
  },
  created() {
    this.loading = true
    //this.view=this.getErpView(this.queryName)

    this.initForm()
    this.loading = false
  },
  methods: {
    /** 查询合计数 */
    getSum(){
      getQuerySum(this.queryName, this.formData).then((response) => {
        this.tableSum = response.data
      })
    },
    
    /** 查询明细数据 */
    getData() {
      getQueryData(this.queryName,this.formData).then((response) => {
        this.tableData = response.data.data
        this.page= response.data.page
      })
    },
    /** 表格明细数据处理 */
    formatCell(row, column, cellValue){
      return this.getErpInfoById(column.property,cellValue)
    },
    /** 表格合计列 */
   getSummaries(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '总计'
          return
        }
        if(this.tableSum[column.property]){
          sums[index]=this.tableSum[column.property]
        }
        else {
          sums[index] = ''
        }
      })
      return sums
    },
    /** 刷新明细页 */
    refreshPage(){
      this.loading = true
      this.getData()
      this.loading = false
    },
    /** 刷新表格 */
    refreshTable(){
      this.formData.pageNum = 1
      this.getSum()
      this.getData()
    },
    /** 初始化Form和表格*/
    initForm(){
      for (const k in this.view.form) {
        this.formData[k]=this.view.form[k].value
      }
      this.refreshTable()
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.loading = true
      this.refreshTable()
      this.loading = false
    },
    handleReset() {
      this.$refs.erpForm.refreshForm()
      this.handleQuery()
    },
    /** 双击打开编辑弹窗 */
    handleUpdate(index) {
    },
    handleSubmit(data) {
      // eslint-disable-next-line no-console
      return Promise.resolve()
    },
    handleDblclickTable(row, column){
    },
    handleVouClose() {
      this.vouVisible = false
      this.loading = true
      this.refreshTable()
      this.loading = false
    },
  },
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