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
    expandProp: '',
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
      /*let newRow = {}
      let list = this.tableData
      let maxId = 0
      this.tableData.push(newRow)
      if (list === 0) {
        list = this.desc.items
        for (const item of list) {
          this.$set(newRow, item.name, null)
        }
      } else {
        maxId = list.reduce((pre, cur) =>{
          return Math.max(Number(cur.id), pre)
        }, 0)
        console.log(list)
        for (const key in list[0]) {
          if (typeof list[0][key] === 'object') {
            /* const item = list[0][key]
            let sub
            for (const ik in item) {
              this.$set(newRow,item.name,null)

              sub[key][ik] = null
            }
            sub['id'] = 1
            if (Object.hasOwnProperty.call(item, 'iid')) {
              sub['iid'] = maxId + 1
            }
          } else {
            this.$set(newRow, key, null)
          }
        }
      }
      this.$set(newRow, 'id', maxId + 1)
      //list.push(newRow)*/
       this.tableData.push({})
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
