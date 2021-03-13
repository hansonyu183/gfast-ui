<template>
  <div>
    <el-input
      prefix-icon="el-icon-search"
      v-model="search"
      placeholder="输入关键字搜索"
      @input="filterDoc"
    />
    <el-table
      v-if="desc.items"
      :data="pageData"
      max-height="600"
      fit
      border
      row-key="id"
      align="left"
      v-on="$listeners"
    >
      <el-table-column
        v-for="item in desc.items"
        :key="'col_' + item.name"
        :prop="item.name"
        :label="item.label"
      >
        <template v-slot="scope">
          <erp-label :itemDesc="item" :value="scope.row[scope.column.property]" />
        </template>
      </el-table-column>
    </el-table>
    <pagination
      class="grid-pagi"
      v-show="pageCount > pageSize"
      :total="pageCount"
      :page.sync="pageNum"
      :limit.sync="pageSize"
    />
  </div>
</template>
<script>
import ErpLabel from './input/erpLabel.vue'
import  mxList  from './minxis/mxList'
export default {
  name: 'ErpList',
  components: { ErpLabel },
  mixins:[mxList],
  props: {
    desc: {
      type: Object
    },
  },
}
</script>

<style>
</style>