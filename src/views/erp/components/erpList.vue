<template>
  <div class="app-container">
    <ele-form
      v-model="queryParams.formData"
      :inline="true"
      :form-desc="formDesc"
      :request-fn="handleSubmit"
      @request-success="handleSuccess"
    >
      <template v-slot:form-btn="{ btns }">
        <el-button
          type="success"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
          >搜索</el-button
        >
        <el-button type="info" icon="el-icon-refresh" size="mini" @click="resetQuery"        
          >重置</el-button
        >
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          >新增</el-button
        >
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          >删除</el-button
        >
      </template>
    </ele-form>
    <el-table
      v-loading="loading"
      :data="list"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />

      <el-table-column
        v-for="item in fields"
        :key="item.prop"
        :label="item.label"
        align="center"
        :prop="item.prop"
      />
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.$index)"
            >修改</el-button
          >
          <el-button
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <ErpVou
      title="客户资料"
      @close="handleVouClose"
      :visible.sync="vouVisible"
      vouName="vr_ba"
      vouId=78045
    >
    </ErpVou>
  </div>
</template>

<script>
import ErpVou from "./erpVou";
import { getListByName,delListByNameIds } from "@/api/module/list";
export default {
  name: "ErpList",
  components: {
    ErpVou
  },
  props: {
    listName: String,
    fields: {
      type: Array,
      default: () => [{ label: "", prop: "" }],
    },
    formDesc: {},
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 客户表格数据
      list: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        formData:{}
      },

      // 是否显示弹出层
      vouVisible: false,
    };
  },
  computed:{
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询列表 */
    getList() {
      this.loading = true;
      getListByName(this.listName, this.queryParams).then((response) => {
        this.list = response.data.list;
        this.total = response.data.total;
        this.loading = false;
      });
    },
    // 表单重置
    reset() {
      this.queryParams.formData = {};
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("form");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item[this.listName+'_id']);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
    },
    /** 双击打开编辑弹窗 */
    handleUpdate(index) {
      this.vouData = this.list[index];
      this.vouVisible = true;
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row[this.listName+'_id'] || this.ids;
      const listName=this.listName
      this.$confirm('是否确认删除编号为"' + ids + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return delListByNameIds(listName,ids);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
        .catch(function () {
        });
    },
    handleSubmit(data) {
      // eslint-disable-next-line no-console
      return Promise.resolve();
    },
    handleSuccess() {
      this.$message.success("创建成功");
      this.handleQuery()
    },

    handleVouClose() {
      this.vouVisible = false;
      // if (this.queryParams.likeStr!= undefined){
      //   this.queryParams.ebaName=this.queryParams.ebaName
      //  }
      this.getList();
    },
  },
};
</script>

<style>
/* el-divider 修改高度&虚线效果 */
.el-divider--horizontal {
  margin: 8px 0;
  background: 0 0;
  border-top: 1px dashed #e8eaec;
}
</style>