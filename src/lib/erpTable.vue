<template>
  <div>
    <el-row v-if="!readOnly" type="flex" class="row-bg" justify="space-between">
      <el-col>
        <el-tooltip v-if="showSave" class="item" effect="dark" content="保存" placement="top-start">
          <el-button type="primary" icon="el-icon-document" @click="saveTable"></el-button>
        </el-tooltip>
      </el-col>
    </el-row>
    <el-form :model="formModel" ref="validForm">
      <el-table
        v-if="desc.items"
        :ref="`tb_${desc.name}`"
        max-height="600"
        style="width: 100%; margin-bottom: 20px"
        fit
        border
        align="left"
        v-bind="$attrs"
        v-on="$listeners"
      >
        <slot name="firstCol"></slot>
        <el-table-column
          :class="`col_${desc.name}_${item.name}`"
          v-for="(item, colIndex) in desc.items"
          :key="'col_' + item.name"
          :prop="item.name"
          :label="item.label"
        >
          <template v-slot="scope">
            <el-form-item
              :prop="`tableData[${scope.$index}].${item.name}`"
              :rules="rules[item.type]"
            >
              <erp-input
                class="tb-input"
                :itemDesc="item"
                :disabled="item.readOnly ? item.readOnly && readOnly : readOnly"
                v-model="scope.row[scope.column.property]"
                @keyup.ctrl.native="onKeyUp($event, colIndex, scope.$index)"
                @change="$emit('cellChange', scope, desc.name)"
              />
            </el-form-item>
          </template>
        </el-table-column>
      </el-table>
    </el-form>
  </div>
</template>
<script>
import ErpInput from './input/erpInput.vue'
import MxTable from './minxis/mxTable'
export default {
  name: 'ErpTable',
  components: { ErpInput },
  mixins: [MxTable],
  props: {},
  data() {
    return {}
  },
  watch: {},
  computed: {}
}
</script>

<style scoped>
.tb-input >>> .el-input__inner {
  border: none;
}
</style>