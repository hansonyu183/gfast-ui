<template>
  <el-table v-bind="$attrs" :data="value" border row-key="id" align="left">
    <el-table-column
      v-for="(item, index) in col"
      :key="item.prop"
      :prop="dropCol[index].prop"
      :width="item.width"
    >
      <template v-slot:header>
        <label v-if="!canModifyUI">{{ item.label }} </label>
        <el-input v-if="canModifyUI" v-model="item.label">
          <i
            slot="suffix"
            class="el-input__icon el-icon-close"
            @click="handleColIconClick(item, index)"
          ></i>
        </el-input>
      </template>
      <template v-slot="scope">
        <label v-if="!canEdit">{{ scope.row[scope.column.property] }} </label>
        <el-input v-if="canEdit" v-model="scope.row[scope.column.property]"></el-input>
      </template>
    </el-table-column>
  </el-table>
</template>
<script>
import Sortable from 'sortablejs'
import { mapGetters } from 'vuex'
export default {
  name: 'DragTable',
  components: {},
  props: {
    desc: {
      type: Object
    },
    value: {
      type: Array
    },
    canEdit: false
  },
  data() {
    return {
      col: this.desc ? [...this.desc] : [],
      dropCol: this.desc ? [...this.desc] : []
    }
  },
  computed: {
    ...mapGetters([
      'canModifyUI'
      // ...
    ])
  },
  watch: {
    canModifyUI: {
      handler() {
        this.sortable.option('disabled', !this.canModifyUI)
      }
    },
    value: {
      handler(newVal, oldVal) {
        if (oldVal === undefined || oldVal === null || oldVal.length == 0) {
          this.initDesc(newVal[0])
        }
      },
      // immediate如果为true 代表如果在 wacth 里声明了之后，就会立即先去执行里面的handler方法
      // 初始化立即执行，这样我们就可以在created中去掉某些预先请求接口了
      immediate: true,
      deep: true // 如果是对象要深度监听
    }
  },

  mounted() {
    //this.columnDrop()
  },
  methods: {
    //列拖拽
    columnDrop() {
      const wrapperTr = document.querySelector('.el-table__header-wrapper tr')
      this.sortable = Sortable.create(wrapperTr, {
        animation: 180,
        delay: 0,
        disabled: !this.canModifyUI,
        onEnd: (evt) => {
          const oldItem = this.dropCol[evt.oldIndex]
          this.dropCol.splice(evt.oldIndex, 1)
          this.dropCol.splice(evt.newIndex, 0, oldItem)
        }
      })
    },
    handleColIconClick(index) {
      this.col.splice(index, 1)
      this.dropCol.splice(index, 1)
    },
    initDesc(valueCol) {
      if ((this.desc === undefined || this.desc.length == 0) && valueCol !== null) {
        this.col = []
        this.dropCol = []
        for (const key in valueCol) {
          const v = {
            label: key,
            prop: key,
            width: 100
          }
          this.col.push(v)
          this.dropCol.push(v)
          this.columnDrop()
        }
      }
    }
  }
}
</script>

<style>
</style>