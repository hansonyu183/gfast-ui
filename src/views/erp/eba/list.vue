<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      label-width="68px"
    >
      <el-form-item label="模糊查找" prop="likeStr">
        <el-input
          v-model="queryParams.likeStr"
          placeholder="部分客户名称或助记码"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
          >重置</el-button
        >
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          >新增</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          >删除</el-button
        >
      </el-col>

      <!-- <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:Eba:export']"
        >导出</el-button>
      </el-col> -->
    </el-row>

    <el-table
      v-loading="loading"
      :data="list"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="编码" align="center" prop="eba_id" />
      <el-table-column label="名称" align="center" prop="eba_name" />
      <el-table-column label="业务员" align="center" prop="Emp.EmpName" />
      <el-table-column label="助记码" align="center" prop="easy_code" />
      <el-table-column
        label="创建日期"
        align="center"
        prop="create_date"
        width="180"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.create_date) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="note" />
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

    <VouDialog
      title="客户资料"
      @close="handleVouClose"
      :visible.sync="vouVisible"
    >
      <template v-slot:main>
        <EbaVou :vouData.sync="vouData" :vouOptions.sync="options"> </EbaVou>
      </template>
    </VouDialog>
  </div>
</template>

<script>
import {
  listEba,
  getOptions,
  getEba,
  delEba,
  addEba,
  updateEba,
  exportEba,
} from "@/api/module/eba";
import EbaVou from "./vou";
import VouDialog from "../voucher/vouDialog";
export default {
  name: "EbaList",
  components: {
    EbaVou,
    VouDialog,
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

      options: {},
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      vouVisible: false,
      // 是否显示弹出层
      vouData: {},
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        likeStr: undefined,
      },
      // 表单参数
      form: {
        likeStr: "",
      },
      // 表单校验
      rules: {
        likeStr: [{ required: true, message: "请输入内容", trigger: "blur" }],
      },
    };
  },
  created() {
    this.getList();
    this.loadOptions();
    this.getDicts("sys_normal_disable").then((response) => {
      this.statusOptions = response.data.values || [];
    });
  },
  methods: {
    /** 查询客户列表 */
    getList() {
      this.loading = true;
      listEba(this.queryParams).then((response) => {
        this.list = response.data.list;
        this.total = response.data.total;
        this.loading = false;
      });
    },
    /** 查询选项列表 */
    loadOptions() {
      getOptions().then((response) => {
        this.options = response.data;
      });
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        name: undefined,
        note: undefined,
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      // if (this.queryParams.likeStr!= undefined){
      //   this.queryParams.ebaName=this.queryParams.ebaName
      //  }
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加客户";
    },
    /** 双击打开编辑弹窗 */
    handleUpdate(index) {
      this.vouData = this.list[index];
      this.vouVisible = true;
    },
    handleVouClose() {
      this.vouVisible = false;
      // if (this.queryParams.likeStr!= undefined){
      //   this.queryParams.ebaName=this.queryParams.ebaName
      //  }
      this.getList();
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != undefined) {
            updateEba(this.form).then((response) => {
              if (response.code === 0) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addEba(this.form).then((response) => {
              if (response.code === 0) {
                this.msgSuccess("新增成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const eids = row.id ? [row.id] : this.ids;
      this.$confirm('是否确认删除客户编号为"' + eids + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return delEba(eids);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
        .catch(function () {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm("是否确认导出所有客户数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return exportEba(queryParams);
        })
        .then((response) => {
          this.download(response.msg);
        })
        .catch(function () {});
    },
  },
};
</script>
