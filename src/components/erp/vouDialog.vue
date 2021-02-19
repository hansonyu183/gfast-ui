<template>
  <div>
    <el-dialog
      v-bind="$attrs"
      v-on="$listeners"
      @open="onOpen"
      @close="onClose"
      :visible="visible"
    >
      <template v-slot:title>
        <el-row type="flex" justify="start" align="top" gutter="1">
          <el-col :span="20">
            <el-row type="flex" justify="start" align="top" gutter="1">
              <el-tooltip
                class="item"
                effect="dark"
                content="前单"
                placement="top-start"
              >
                <el-button icon="el-icon-arrow-left" @click="onPre"></el-button>
              </el-tooltip>
              <el-tooltip
                class="item"
                effect="dark"
                content="后单"
                placement="top-start"
              >
                <el-button
                  icon="el-icon-arrow-right"
                  @click="onNext"
                ></el-button>
              </el-tooltip>
              <el-tooltip
                class="item"
                effect="dark"
                content="菜单"
                placement="top-start"
              >
                <el-button
                  icon="el-icon-caret-bottom"
                  @click="onOpenMenu"
                ></el-button>
              </el-tooltip>
              <el-tooltip
                class="item"
                effect="dark"
                content="打印"
                placement="top-start"
              >
                <el-button
                  type="info"
                  icon="el-icon-printer"
                  @click="onPrint"
                ></el-button>
              </el-tooltip>
              <el-tooltip
                class="item"
                effect="dark"
                content="新增"
                placement="top-start"
              >
                <el-button
                  type="primary"
                  icon="el-icon-plus"
                  @click="onAddNew"
                ></el-button>
              </el-tooltip>
              <el-tooltip
                v-show="vouState.nextTooltip != undefine"
                class="item"
                effect="dark"
                :content="vouState.nextTooltip"
                placement="top-start"
              >
                <el-button
                  type="success"
                  :icon="vouState.nextIcon"
                  @click="onGoNext"
                ></el-button>
              </el-tooltip>
              <el-tooltip
                v-show="vouState.backTooltip != undefine"
                class="item"
                effect="dark"
                :content="vouState.backTooltip"
                placement="top-start"
              >
                <el-button
                  type="warning"
                  :icon="vouState.backIcon"
                  @click="onGoback"
                ></el-button>
              </el-tooltip>
            </el-row>
          </el-col>
          <el-col :span="4">
            <el-tag type="danger">{{ vouState.text }}</el-tag>
          </el-col>
        </el-row>
      </template>

      <el-row type="flex" justify="start" align="top" gutter="1">
        <slot name="main"> </slot>
      </el-row>
      <el-row type="flex" justify="start" align="top" gutter="1">
        <slot name="item"> </slot>
      </el-row>
      <template v-slot:footer>
        <el-form
          ref="elForm"
          :model="vouData"
          :rules="rules"
          label-width="100px"
        >
          <el-row type="flex" justify="start" align="top" gutter="15">
            <el-form-item label="制单日期" prop="vouInfo.createDate">
              <el-input
                v-model="vouInfo.createDate"
                placeholder=""
                clearable
                :style="{ width: '100%' }"
              ></el-input>
            </el-form-item>
            <el-form-item label="制单" prop="vouInfo.createUserId">
              <el-input
                v-model="vouInfo.createUserId"
                placeholder=""
                clearable
                :style="{ width: '100%' }"
              ></el-input>
            </el-form-item>
            <el-form-item label="审核日期" prop="vouInfo.checkDate">
              <el-input
                v-model="vouInfo.checkDate"
                placeholder=""
                clearable
                :style="{ width: '100%' }"
              ></el-input>
            </el-form-item>
            <el-form-item label="审核" prop="vouInfo.checkUserId">
              <el-input
                v-model="vouInfo.checkUserId"
                placeholder=""
                clearable
                :style="{ width: '100%' }"
              ></el-input>
            </el-form-item>
          </el-row>
        </el-form>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import {
  listVou,
  getVou,
  getPreVou,
  getNextVou,
  delVou,
  addVou,
  updateVou,
  goBackVou,
  goNextVou,
  exportVou,
} from "@/api/erp/voucher";

export default {
  name: "VouDialog",
  inheritAttrs: false,
  components: {},
  props: {
    visible: Boolean,
    title: String,
    mainData:[{
      tableName:String,
      tableData:{}
    }],
    itemData:[{
      tableName:String,
      tableData:{}
    }],
    // vouData: {},
    // vouOptions: {},
  },
  data() {
    return {
      vouInfo: {
        id: 0,
        date: "",
        no: "",
        state: 1,
        createDate: "",
        createUserId: 0,
        checkDate: "",
        checkUserId: 0,
      },
    };
  },
  computed: {
    vouState: function () {
      let textMap = new Map([
        [-1, "作废"],
        [0, "新单"],
        [1, "待审核"],
        [2, "已审核"],
        [3, "已完成"],
      ]);
      let backTooltipMap = new Map([
        [1, "作废"],
        [2, "反审核"],
        [3, "反完成"],
      ]);
      let nextTooltipMap = new Map([
        [-1, "反作废"],
        [0, "保存"],
        [1, "审核"],
        [2, "完成"],
      ]);
      let backIconMap = new Map([
        [1, "el-icon-delete"],
        [2, "el-icon-refresh-left"],
        [3, "el-icon-refresh-left"],
      ]);
      let nextIconMap = new Map([
        [-1, "el-icon-refresh-left"],
        [0, "el-icon-document"],
        [1, "el-icon-check"],
        [2, "el-icon-finished"],
      ]);
      return {
        text: textMap.get(this.vouInfo.state),
        backTooltip: backTooltipMap.get(this.vouInfo.state),
        nextTooltip: nextTooltipMap.get(this.vouInfo.state),
        backIcon: backIconMap.get(this.vouInfo.state),
        nextIcon: nextIconMap.get(this.vouInfo.state),
      };
    },
  },
  watch: {},
  created() {},
  mounted() {},
  methods: {
    onPre() {
      this.getPreVou(this.vouInfo.id)
    },
    onNext() {
      this.getNextVou(this.vouInfo.id)
    },
    onOpenMenu() {},
    onPrint() {},
    onAddNew() {
      this.vouInfo.state = 0;
    },
    onGoback() {
      this.goBackVou(this.vouInfo.id)
      this.vouInfo.state--;
      if (this.vouInfo.state == 0) {
        this.vouInfo.state--;
      }
    },
    onGoNext() {
      this.goNextVou(this.vouInfo.id)
      this.vouInfo.state++;
      if (this.vouInfo.state == 0) {
        this.vouInfo.state++;
      }
    },
    onClose() {
      this.$refs["elForm"].resetFields();
    },
    close() {
      this.$emit("update:visible", false);
    },
    handelConfirm() {
      this.$refs["elForm"].validate((valid) => {
        if (!valid) return;
        this.close();
      });
    },
  },
};
</script>

<style>
.el-row {
  margin-bottom: 10px;
}
</style>