<template>
  <el-select
    ref="elselect"
    filterable
    :filter-method="filterOption"
    clearable
    default-first-option
    @focus="onFocus"
    @blur="onBlur"
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
      showOptions: []
    }
  },
  computed: {
    ...mapGetters([
      'getOpt'
      // ...
    ]),
    docName: {
      get() {
        let dicName = this.prop.slice(0, -3)
        const did = dicName.lastIndexOf('_')
        if (did !== -1) {
          dicName = dicName.substr(did + 1)
        }
        return dicName
      }
    },
    docOptions: {
      get() {
        return this.getOpt(this.docName)
      }
    },
    inputVal: {
      get() {
        return this.$attrs?.value
      }
    }
  },
  watch: {
    inputVal: {
      handler(newVal, oldVal) {
        if (
          newVal !== oldVal &&
          this.showOptions.findIndex((obj) => obj.id === this.inputVal) === -1
        ) {
          this.updateOptions()
        }
      },
      immediate: true
    }
  },
  created() {},
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
        this.updateOptions()
      }
    },
    onBlur() {
      this.$refs.elselect.blur()
    },
    updateOptions() {
      if (!this.prop) {
        return
      }
      // this.docOptions = this.getOpt(dicName)
      if (!this.docOptions) {
        return
      }
      const idx = this.docOptions.findIndex((obj) => obj.id === this.inputVal)
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
    },
    focus() {
      this.$refs.elselect.focus()
    }
  }
}
</script>

<style>
</style>