<template>
  <el-select ref="elselect" clearable default-first-option  v-bind="$attrs" v-on="$listeners">
    <el-option
      v-for="item in sqOption"
      :key="item.dictCode"
      :label="item.dictLabel"
      :value="item.dictValue"
    >
    </el-option>
  </el-select>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'DictSelect',
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
      'getDict'
      // ...
    ]),
    sqOption: {
      get() {
        return this.getDict(this.prop)
      }
    },
    defaultOption: {
      get() {
        return this.sqOption.find((obj) => obj.isDefault === true)
      }
    },
    inputVal: {
      get() {
        return this.$attrs.value
      }
    }
  },
  watch: {
    inputVal: {
      handler(val) {
        if (val === '' || val === undefined || val === null) {
          this.$emit('input', this.defaultOption.dictValue)
        }
      }
    }
  },

  created() {},
  methods: {}
}
</script>

<style>
</style>