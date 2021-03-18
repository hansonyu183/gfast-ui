<template>
  <el-select ref="elselect" clearable default-first-option v-bind="$attrs" v-on="$listeners">
    <el-option v-for="item in sqOption" :key="item.id" :label="item.name" :value="item.price">
    </el-option>
  </el-select>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'SqPriceSelect',
  props: {
    prop: {
      type: String,
      required: true
    }
  },
  data() {
    return {}
  },
  computed: {
    ...mapGetters([
      'getOpt'
      // ...
    ]),
    sqOption: {
      get() {
        return this.getOpt('ebasq')
      }
    }
  },
  watch: {},

  created() {},
  methods: {}
}
</script>

<style>
</style>