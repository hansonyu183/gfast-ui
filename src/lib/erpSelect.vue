<template>
  <el-select filterable clearable placeholder="请选择" v-bind="$attrs" v-on="$listeners">
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value"
      :filter-method="filterOption"
    >
    </el-option>
  </el-select>
</template>

<script>
export default {
  name: 'ErpSelect',
  props: {
    dictName: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      options: []
    }
  },
  computed: {},
  watch: {},
  created() {},
  methods: {
    getDict() {
      var dt = this.$store.state.erp[this.dictName]
      const dict = []
      dt.forEach((obj, index) => {
        dict[index] = { value: obj.id, label: obj.name }
      })
      this.options = dict
    },
    filterOption(query) {
      if (query !== '') {
        this.options = this.options.filter((item) => {
          return (
            item.label.toLowerCase().indexOf(query.toLowerCase()) > -1 ||
            item.value.toLowerCase().indexOf(query.toLowerCase()) > -1
          )
        })
      } else {
        this.options = []
      }
    }
  },
  mounted() {
    this.getDict()
  }
}
</script>

<style>
</style>