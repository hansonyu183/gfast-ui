<script>
import { mapGetters } from 'vuex'
import { deepTrimNull } from '@/lib/utils'
import printJS from 'print-js'

export default {
  name: 'MxEditor',
  props: {
    desc: {},
    dataType: '',
    dataId: 0,
    printCss: ''
  },
  data() {
    return {
      id: this.dataId,
      nextId: 0,
      preId: 0,
      data: {},
      api: {},
      printObj: {
        printable: 'print',
        type: 'html',
        scanStyles: false,
        css: this.printCss,
        ignoreElements: ['no-print', 'bc', 'gb']
      },
      rules: {
        name: [{ required: true, message: '不能为空', trigger: [] }],
        no: [{ required: true, message: '不能为空', trigger: [] }],
        docKey: [{ required: true, message: '不能为空', trigger: [] }],
        eba: [{ required: true, message: '不能为空', trigger: [] }],
        unum: [
          {
            pattern: /^(0\.?\d{0,4}|[1-9]\d*\.?\d{0,4})$/,
            message: '正数且小数位小于4',
            trigger: []
          }
        ]
      }
    }
  },
  computed: {
    ...mapGetters({
      stateStore: 'state'
      // ...
    }),
    mainForm: {},
    stateId: {
      get: function () {
        return this.mainForm?.state_id ?? 0
      },
      set: function (newVal) {
        if (this.mainForm) {
          this.mainForm.state_id = newVal
        }
      }
    },
    readOnly: {
      // getter
      get: function () {
        return 1 === this.stateStore.find((obj) => obj.id === this.stateId)?.read_only
      }
    }
  },
  watch: {
    dataId: {
      handler(nval) {
        this.id = nval
      }
    },
    id: {
      handler() {
        this.getData()
      },
      immediate: true
    }
  },

  methods: {
    /** 查询明细数据 */
    getData() {
      this.api.getByID(this.dataType, this.id).then((response) => {
        if (response.code === 200) {
          this.nextId = response.data.nextID
          this.preId = response.data.preID
          this.data = response.data
        } else {
          this.msgError(response.msg)
        }
      })
    },

    delData() {
      this.api.delByID(this.dataType, this.id).then((response) => {
        if (response.code === 200) {
          this.id = 0
          this.msgSuccess('删除成功')
        } else {
          this.msgError(response.msg)
        }
      })
    },

    saveData(act) {
      deepTrimNull(this.data)
      this.api.saveByID(this.dataType, this.id, this.data).then((response) => {
        if (response.code === 200) {
          if (this.id === 0) {
            this.id = response.data
          }
          this.stateId = act.set_state_id
          this.msgSuccess('保存成功')
        } else {
          this.msgError(response.msg)
        }
      })
    },

    doAction(act) {
      this.api.docAction(this.dataType, this.id, act.id).then((response) => {
        if (response.code === 200) {
          this.stateId = act.set_state_id
          this.msgSuccess(act.name + '成功')
          //
        } else {
          this.msgError(response.msg)
        }
      })
    },
    validForm() {
      let pass = false
      this.$refs.editorForm.validate((valid) => {
        pass = valid
      })
      return pass
    },
    onAction(act) {
      switch (act.no) {
        case 'add':
          //this.getData()
          break
        case 'pre':
          //this.getData()
          break
        case 'next':
          //this.getData()
          break
        case 'print':
          printJS(this.printObj)
          break
        case 'del':
          this.delData()
          break
        case 'save':
          if (this.validForm()) {
            this.saveData(act)
          } else {
            this.msgError('数据有误，请核查！')
          }
          break
        default:
          this.doAction(act)
          break
      }
    }
  }
}
</script>