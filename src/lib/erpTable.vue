<template>
  <div>
    <el-row type="flex" class="row-bg" justify="space-between">
      <el-col>
        <el-input
          prefix-icon="el-icon-search"
          v-model="search"
          placeholder="输入关键字搜索"
          @input="filterDoc"
        />
      </el-col>
      <el-col v-if="!readOnly">
        <el-tooltip class="item" effect="dark" content="新增" placement="top-start">
          <el-button type="primary" icon="el-icon-plus" @click="addRow"></el-button>
        </el-tooltip>
      </el-col>
    </el-row>
    <el-table
      v-if="tableDesc.cols"
      :data="pageData"
      max-height="600"
      fit
      border
      row-key="id"
      align="left"
      v-on="$listeners"
    >
      <el-table-column
        v-for="item in tableDesc.cols"
        :key="'col_' + item.name"
        :prop="item.name"
        :width="item.width"
        :label="item.label"
      >
        <template v-slot="scope">
          <erp-label v-if="readOnly" :itemDesc="item" :value="scope.row[scope.column.property]" />
          <erp-input v-if="!readOnly" :itemDesc="item" v-model="scope.row[scope.column.property]" />
        </template>
      </el-table-column>
      <el-table-column v-if="!readOnly" fixed="right" label="操作" width="120">
        <template slot-scope="scope">
          <el-button
            @click.native.prevent="delRow(scope.$index, tableData)"
            type="text"
            size="small"
          >
            移除
          </el-button>
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
import { mapGetters } from 'vuex'
import { debounce } from '@/utils'
import ErpLabel from './erpLabel.vue'
import ErpInput from './erpInput.vue'
export default {
  name: 'ErpTable',
  components: { ErpLabel, ErpInput },
  props: {
    desc: {
      type: Object
    },
    value: {
      type: Array
    },
    readOnly: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      //cols: this.desc?.cols ? [...this.desc.cols] : [],
      search: '',
      tableDesc: this.desc,
      tableData: [],
      pageNum: 0,
      pageSize: 10
    }
  },
  computed: {
    ...mapGetters([
      'getColsDescByValue'
      // ...
    ]),
    pageCount: function () {
      return this.tableData?.length ?? 0
    },
    pageData() {
      if (this.tableData) {
        let pd = this.tableData.slice(
          (this.pageNum - 1) * this.pageSize,
          this.pageNum * this.pageSize - 1
        )
        return pd
      } else return []
    }
  },
  watch: {
    value: {
      handler(newVal) {
        if ((this.tableDesc?.cols?.length ?? 0) === 0 && newVal) {
          //修改props和state
          this.tableDesc['cols'] = this.getColsDescByValue(newVal[0])
        }
        this.tableData = newVal
      },
      // immediate如果为true 代表如果在 wacth 里声明了之后，就会立即先去执行里面的handler方法
      // 初始化立即执行，这样我们就可以在created中去掉某些预先请求接口了
      immediate: true,
      deep: true // 如果是对象要深度监听
    }
  },
  mounted() {},
  methods: {
    addRow() {
      let newRow = {}
      for (const val of this.tableDesc.cols) {
        newRow[val.name] = ''
      }
      this.tableData.push(newRow)
    },
    delRow(index, rows) {
      rows.splice(index, 1)
    },
    filterDoc: debounce(function () {
      if (this.search !== '') {
        let s = this.search.toLowerCase()
        this.tableData = this.value.filter((item) => {
          return (
            item.no.toLowerCase().includes(s) ||
            item.name.toLowerCase().includes(s) ||
            item.py.toLowerCase().includes(s)
          )
        })
      } else {
        this.tableData = [...this.value]
      }
    }, 300)
  }
}
</script>

<style>
</style>