<template>
  <el-select
    filterable
    clearable
    default-first-option
    :filter-method="filterOption"
    placeholder="请选择"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <el-option
      v-for="item in options"
      :key="item.id"
      :label="item.no + ':' + item.name"
      :value="item.id"
    >
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
    },
  },
  data() {
    return {
      options: [],
      docOption: []
    }
  },
  computed: {
    ...mapGetters([
      'getDoc'
      // ...
    ])
  },
  watch: {},
  created() {
    let dicName = this.prop.slice(0, -3)
    const idx = dicName.lastIndexOf('_')
    if (idx !== -1 ){
     dicName = dicName.substr(idx+1)
    }
    this.docOption =[... this.getDoc(dicName)]
  },
  methods: {
    filterOption(query) {
      if (query) {
        const q = query.toLowerCase()
        this.options = this.docOption
          .filter((item) => {
            return (
              item?.no?.toLowerCase().includes(q) ||
              item?.name?.toLowerCase().includes(q) ||
              item?.py?.toLowerCase().includes(q)
            )
          })
          ?.slice(0, 10)
      } else {
        this.options = this.docOption?.slice(0, 10)
      }
    }
  },
  mounted() {
    this.options = this.docOption?.slice(0, 10)
  }
}
</script>

<style>
</style>