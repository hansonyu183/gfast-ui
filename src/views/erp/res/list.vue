  <template>
  <ErpList listName='res' :fields='fields' :formDesc='formDesc' >
  </ErpList>
</template>

<script>
import ErpList from '../components/erpList';
export default {
  name: 'ResList',
  components: {
    ErpList,
  },

  props: {},
  data() {
    return {
      // 查询参数
      formDesc: {
        likeStr: {
          type: 'input',
          label: '查找内容',
          layout:8,
        },
         res_kind: {
          type: 'select',
          label: '类别',          
          layout:8,
          options: [
            { value: 40, text: '客户配水' },
            { value: 50, text: '原材料' },
            { value: 60, text: '服务' },
          ],
          attrs: {
            multiple :true,
          }
        },
        res_model: {
          type: 'input',
          label: '型号',
          layout:8
        },
        cost_price: {
          type: 'input',
          label: '成本',
          layout:8
        }, 
      },
      fields: [
        {
          label: '编号',
          prop: 'res_id',
        },
        {
          label: '名称',
          prop: 'res_name',
        },
        {
          label: '成本',
          prop: 'cost_price',
        },
        {
          label: '包装',
          prop: 'res_spec',
        },
        {
          label: '类别',
          prop: 'name',
        },
      ],
    };
  },
  created() {
    //this.likeStr='xyz'
  },
  methods: {},
};
</script>
