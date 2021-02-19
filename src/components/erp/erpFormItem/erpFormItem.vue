<template>
  <el-form-item 
  :label="getErpTranslate(itemProp)"
  :prop="itemProp">  
    <erp-select v-if="item.type === 'select'"
      v-bind="$attrs" v-on="$listeners"
      :dictName="itemProp"/>
    <el-date-picker v-else-if="item.type  === 'date'"
      v-bind="$attrs" v-on="$listeners"
      type="date"
      placeholder="选择日期"
      format="yyyy 年 MM 月 dd 日"
      value-format="yyyyMMdd"/>
    <el-date-picker v-else-if="item.type  === 'month'"
      v-bind="$attrs" v-on="$listeners"
      type="month"
      placeholder="选择月"
      format="yyyy 年 MM 月"
      value-format="yyyyMM"/>
    <div  v-else-if="item.type  === 'check'">
      <el-checkbox-group   v-bind="$attrs" v-on="$listeners" >
      <el-checkbox v-for="item in checkOption" :label="item" :key="item">{{getErpTranslate(item)}}</el-checkbox>
      </el-checkbox-group>  
    </div>
    <el-input v-else-if="item.type  === 'input'"
      v-bind="$attrs" v-on="$listeners"
    />
    <el-input v-else 
      v-bind="$attrs" v-on="$listeners"
    />
  </el-form-item>
</template>

<script>
import { mapGetters } from 'vuex'
import ErpSelect from "./components/erpSelect";

export default {
  name: "ErpFormItem",
  components: {
    ErpSelect
  },
  props: {
    itemProp:{
      type:String,
      request:true
    },
    item:{
      type:Object,
      request:true
    }
  },
  data() {
    return {
        checkOption:this.$attrs.value,
        itemRules: {
          dict: [],
          date: [],
          month:[],
          dateRange:[],
          monthRange:[]
        },
    };
  },
  computed: {
    ...mapGetters([
      'getErpTranslate',
      // ...
    ])
  },
  watch: {},
  created() {
  },
  methods: {
  },
  mounted() {
  }};
</script>

<style>

</style>