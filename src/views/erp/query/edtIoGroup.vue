  <template>
  <erp-query queryName="edtIoGroup" :view="view" > </erp-query>
</template>

<script>
import * as erp from "@/utils/erp";
import ErpQuery from "./components/erpQuery.vue";
export default {
  name: "QueryEdtIoGroup",
  components: {
    ErpQuery,
  },

  props: {},
  data() {
    return{
      view:{
        table:[
            'vr_type',
            'emp_id',
            'unit_id',
            'res_id',
            'i_num',
            'i_amo',
            'o_num',
            'o_num',
            'e_profit',
            'i_profit',
            'sale_amo',
            'sale_profit',
          ],
        form:{
            beg_date:{type:"date",value:erp.CurrentMonthFirstDay()},
            end_date:{type:"date",value:erp.toDay()},
            res_id:{type:"select"},
            emp_id:{type:"select"},
            unit_id:{type:"select"},
            vr_type:{type:"select"},
            groupBy:{type:"check",value:[
            'vr_type',
            'emp_id',
            'unit_id',
            'res_id']}
        },
      }
    };
  },
  created() {
  },
  methods: {},
};
</script>
