<script>
export default {
  props: {
    desc: {
      type: Object
    },
    value: {
      type: Array
    },
    mainProp: '',
    expandProp:'',
    formRules: {},
    readOnly: false,
    showSave: false
  },
  data() {},
  watch: {},
  computed: {
    tableData: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    },

    colNum: {
      get: function () {
        return this.desc.items.length
      }
    },
    rowNum: {
      get: function () {
        return this.tableData?.length
      }
    },
    cellNum: {
      get: function () {
        return this.rowNum * this.colNum
      }
    },
    cells: {
      get: function () {
        return this.$refs[`tb_${this.desc.name}`].$children.find(
          (obj) => obj.$el.className === 'el-table__body'
        )?.$children
      }
    }
  },
  methods: {
    saveTable() {
      this.$emit('saveTable', this.desc.name)
    },
    addRow() {
      let newRow = {}
      for (const item of this.desc.items) {
        newRow[item.name] = null
      }
      let maxId = 0
      if (this.tableData.length > 0) {
        maxId = this.tableData.reduce(function (pre, cur) {
          return Math.max(cur.id, pre)
        }, 0)
      }
      const newID = maxId + 1
      newRow['id'] = newID
      this.tableData.push(newRow)
    },
    delRow(index) {
      if (this.tableData.length > 1) {
        this.tableData.splice(index, 1)
      }
    },
    //键盘触发事件
    onKeyUp(ev, colIndex, rowIndex, row) {
      //向上 =38
      if (ev.keyCode == 38) {
        if (rowIndex > 0) {
          const cellIndex = (rowIndex - 1) * this.colNum + colIndex + 1
          this.cells[cellIndex]?.$children[1].focus()
        }
      }
      //下 = 40
      if (ev.keyCode == 40) {
        if (rowIndex === this.rowNum - 1) {
          this.addRow()
        }
        const cellIndex = (rowIndex + 1) * this.colNum + colIndex + 1
        this.$nextTick(() => {
          this.cells[cellIndex]?.$children[1].focus()
        })
      }

      //左 = 37
      if (ev.keyCode == 37) {
        if (colIndex > 1) {
          const cellIndex = rowIndex * this.colNum + colIndex
          this.cells[cellIndex]?.$children[1].focus()
        }
      }

      //右 = 39
      if (ev.keyCode == 39) {
        if (colIndex < this.colNum) {
          const cellIndex = rowIndex * this.colNum + colIndex + 2
          this.cells[cellIndex]?.$children[1].focus()
        }
      }
      //删除 = 46
      if (ev.keyCode == 46) {
        this.delRow(rowIndex, row)
      }
    }
  }
}
</script>
