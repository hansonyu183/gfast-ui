<template>
  <el-select
    ref="elselect"
    filterable
    clearable
    default-first-option
    placeholder="请选择"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <el-option v-for="item in showOptions" :key="item.id" :label="item.name" :value="item.id">
    </el-option>
  </el-select>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'DocSelect',
  props: {
    prop: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      //options: [],
      // docOption: []
    }
  },
  computed: {
    ...mapGetters([
      'getDoc'
      // ...
    ]),
    inputVal: {
      get() {
        return this.$attrs?.value
      }
    },
    docName: {
      get() {
        let dicName = this.prop.slice(0, -3)
        const idx = dicName.lastIndexOf('_')
        if (idx !== -1) {
          dicName = dicName.substr(idx + 1)
        }
        return dicName
      }
    },
    docOptions: {
      get() {
        return this.getDoc(this.docName)
      }
    },
    showOptions: {
      get() {
        let options = []

        if (typeof this.inputVal === 'number') {
          const idx = this.docOptions?.findIndex((obj) => obj.id === this.inputVal)
          if (idx === -1) {
            options = this.docOptions?.slice(0, 10)
            return
          }
          const len = this.docOptions.length
          if (len >= 10) {
            const begIdx = idx + 10 < len ? idx : Math.max(len - 10, 0)
            options = this.docOptions?.slice(begIdx, begIdx + 10)
          } else {
            options = this.docOptions
          }
          return options
        }

        if (this.inputVal !== '' && this.docOptions) {
          const q = this.inputVal.toLowerCase()
          options = this.docOptions
            .filter((item) => {
              return (
                item?.no?.toLowerCase().includes(q) ||
                item?.name?.toLowerCase().includes(q) ||
                item?.py?.toLowerCase().includes(q)
              )
            })
            ?.slice(0, 10)
        } else {
          options = this.docOptions?.slice(0, 10)
        }
        return options
      }
    }
  },
  watch: {
    /*inputVal: {
      handler(newVal) {
        if (newVal) {
          this.filterOption(newVal)
        }
      },
      immediate: true
    }*/
  },
  created() {
    //this.initOptions()
  },
  methods: {
    filterOption(query) {
      if (query !== '') {
        const q = query.toLowerCase()
        this.options = this.docOptions
          .filter((item) => {
            return (
              item?.no?.toLowerCase().includes(q) ||
              item?.name?.toLowerCase().includes(q) ||
              item?.py?.toLowerCase().includes(q)
            )
          })
          ?.slice(0, 10)
      } else {
        this.options = this.docOptions?.slice(0, 10)
      }
    },
    initOptions() {
      const idx = this.docOptions.findIndex((obj) => obj.id === this.$attrs.value)
      console.log(idx)
      if (idx === -1) {
        this.options = this.docOptions?.slice(0, 10)
        return
      }
      const len = this.docOptions.length
      if (len >= 10) {
        const begIdx = idx + 10 < len ? idx : Math.max(len - 10, 0)
        console.log(begIdx)
        this.options = this.docOptions?.slice(begIdx, begIdx + 10)
      } else {
        this.options = this.docOptions
      }
    }
  },
  mounted() {}
}
</script>

<style>
</style>