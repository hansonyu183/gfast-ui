  <template>
  <erp-query queryName="edtIo" :view="view" > </erp-query>
</template>

<script>
import * as erp from "../../../lib/utils";

import ErpQuery from "./components/erpQuery.vue";
export default {
  name: "QueryEdtIo",
  components: {
    ErpQuery,
  },

  props: {},
  data() {    
    return{
      view:{
        form:{
            beg_date:{type:"date",value:erp.CurrentMonthFirstDay()},//this.parseDate(Date(),"yyyymmdd")
            end_date:{type:"date",value:erp.toDay()},
            res_id:{type:"select"},
            emp_id:{type:"select"},
            unit_id:{type:"select"},
            vr_type:{type:"select"},
        },
        table:[
            'vr_type',
            'vr_date',
            'vr_no',
            'emp_id',
            'unit_id',
            'res_id',
            'b_num',
            'i_num',
            'o_num',
            'e_num',
            'last_cost',
            'cost',
            'io_price',
            'b_amo',
            'i_amo',
            'o_amo',
            'e_amo',
            'e_profit',
            'i_profit',
            'sale_amo',
            'sale_profit',
            'sale_profit_rate'
          ],
      }
    };
  },
  created() {
  },
  methods: {
  },
};
</script>
