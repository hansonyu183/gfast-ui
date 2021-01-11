<template>
  <div>
        <el-form
          ref="elForm"
          :model="vouData"
          :rules="rules"
          label-width="100px"
        >
          <el-row type="flex" justify="start" align="top" gutter=15>
            <el-form-item label="名称" prop="name">
              <el-input
                v-model="vouData.name"
                placeholder="请输入名称"
                clearable
                :style="{ width: '100%' }"
              >
              </el-input>
            </el-form-item>
            <el-form-item label="选择业务员" prop="emp_name">
              <el-select
                v-model="vouData.emp_id"
                placeholder="请选择"
                clearable
                :style="{ width: '100%' }"
              >
                <el-option
                  v-for="(item, index) in vouOptions.emp"
                  :key="index"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-row>
          <el-row type="flex" justify="start" align="top" gutter=15>
            <el-form-item label="备注" prop="note">
              <el-input
                v-model="vouData.note"
                type="textarea"
                placeholder="请输入备注"
                :style="{ width: '100%' }"
              ></el-input>
            </el-form-item>
          </el-row>
        </el-form>
  </div>
</template>

<script>

export default {
  name: "EbaVou",
  inheritAttrs: false,
  components: {
  },
  props: {
    vouData: {},
    vouOptions: {},
  },
  data() {
    return {
      rules: {
        date: [
          {
            required: true,
            message: "单选框组不能为空",
            trigger: "change",
          },
        ],
        no: [
          {
            required: true,
            message: "请输入单号",
            trigger: "blur",
          },
        ],
        name: [
          {
            required: true,
            message: "请输入名称",
            trigger: "blur",
          },
        ],
      },
    };
  },
  computed: {},
  watch: {},

  created() {},
  mounted() {},
  methods: {
  },
};
</script>

<style>
.el-row {
  margin-bottom: 20px;
}
</style>