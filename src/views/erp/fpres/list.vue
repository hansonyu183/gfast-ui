  <template v-slot:formItem>
  <ErpList
  v-bind="viewProps"
    :formData.sync="formData"
  >
    <el-form-item label="模糊查找" prop="likeStr">
      <el-input
        :model="formData.likeStr"
        placeholder="部分客户名称或助记码"
        clearable
        size="small"
      />
    </el-form-item>
  </ErpList>
</template>

<script>
import ErpList from "@/components/erp/erpList";
export default {
  name: "FpresList",
  components: {
    ErpList,
  },

  props: {},
  data() {
    return {
      // 查询参数
      formData: {
        likeStr: undefined,
      },
      viewProps: {
        listName: "fpres",
        fields: [
          {
            label: "名称",
            prop: "name",
          },
          {
            label: "型号",
            prop: "model",
          },
          {
            label: "税号",
            prop: "tax_no",
          },
          {
            label: "库存",
            prop: "end_num",
          },
        ],
      },
    };
  },
  created() {},
  methods: {},
};
</script>
