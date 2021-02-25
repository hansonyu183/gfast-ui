<template>
  <el-select
    ref="elselect"
    filterable
    :filter-method="filterOption"
    clearable
    default-first-option
    placeholder="请选择"
    @focus="onFocus"
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
      docOptions: [],
      showOptions: []
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
    }
    /*
    showOptions: {
      get() {
        if (!this.docOptions) {
          return []
        }
        if (!this.inputVal && this.inputVal === '') {
          return this.docOptions?.slice(0, 10)
        }

        let options = []

        if (typeof this.inputVal === 'number') {
          const idx = this.docOptions.findIndex((obj) => obj.id === this.inputVal)
          if (idx === -1) {
            options = this.docOptions.slice(0, 10)
            return
          }
          const len = this.docOptions.length
          if (len >= 10) {
            const begIdx = idx + 10 < len ? idx : Math.max(len - 10, 0)
            options = this.docOptions.slice(begIdx, begIdx + 10)
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
        }
        return options
      }
    }*/
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
    // this.initOptions()
  },
  methods: {
    filterOption(query) {
      if (query !== '') {
        const q = query.toLowerCase()
        this.showOptions = this.docOptions
          .filter((item) => {
            return (
              item?.no?.toLowerCase().includes(q) ||
              item?.name?.toLowerCase().includes(q) ||
              item?.py?.toLowerCase().includes(q)
            )
          })
          ?.slice(0, 10)
      } else {
        this.showOptions = this.docOptions?.slice(0, 10)
      }
    },
    onFocus() {
      if (!this.showOptions || this.showOptions.length === 0) {
        this.filterOption(this.$refs.elselect.query)
      }
    },
    initOptions() {
      if (!this.prop) {
        return
      }

      let dicName = this.prop.slice(0, -3)
      const did = dicName.lastIndexOf('_')
      if (did !== -1) {
        dicName = dicName.substr(did + 1)
      }
      this.docOptions = this.getDoc(dicName)
      if (!this.docOptions) {
        return
      }

      const idx = this.docOptions.findIndex((obj) => obj.id === this.$attrs.value)
      if (idx === -1) {
        this.showOptions = this.docOptions.slice(0, 10)
        return
      }

      const len = this.docOptions.length
      if (len >= 10) {
        const begIdx = idx + 10 < len ? idx : Math.max(len - 10, 0)
        this.showOptions = this.docOptions?.slice(begIdx, begIdx + 10)
      } else {
        this.showOptions = this.docOptions
      }
    }
  },
  beforeUpdate() {
    this.initOptions()
  }
}
</script>

<style>
</style>