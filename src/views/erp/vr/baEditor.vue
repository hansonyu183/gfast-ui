<template>
  <vr-ba-editor
    ref="editor"
    type="BA"
    :serv="serv"
    :dataId="0"
    :desc="pageDesc"
    printCss="./print/vr_ba.css"
  >
  </vr-ba-editor>
</template>

<script>
import VrBaEditor from './components/vrBaEditor.vue'
import { server } from './serv/baServ.js'
import Page from '../page'
export default {
  name: 'BaEditor',
  components: {
    VrBaEditor
  },
  mixins: [Page],
  computed: {
    serv: () => server
  },

  data() {
    return {
      pageName: 'baEditor',
      desc: {
        label: '产品列表',
        name: 'baEditor',
        name: 'resEditor',
        label: 'resEditor',
        vr: {
          name: 'vr',
          label: 'vr',
          items: [
            {
              label: '日期',
              name: 'date',
              type: 'date'
            },
            {
              label: '单号',
              name: 'no',
              type: 'no'
            }
          ]
        },
        vrMain: {
          name: 'vr_main',
          label: '主表单',
          items: [
            {
              label: '客户',
              name: 'eba_id',
              type: 'eba'
            },
            {
              label: '金额',
              name: 'amo',
              type: 'unum'
            },
            {
              label: '交货日期',
              name: 'tran_date',
              type: 'date'
            },
            {
              label: '运输方式',
              name: 'tran_price',
              type: 'dict'
            },
            {
              label: '数期',
              name: 'sq_price',
              type: 'sqPrice'
            },
            {
              label: '打印桶数',
              name: 'print_pack_num',
              type: 'unum'
            },
            {
              label: '打印金额',
              name: 'print_amo',
              type: 'unum'
            },
            {
              label: '业务',
              name: 'emp_id',
              type: 'docKey'
            },
            {
              label: '备注',
              name: 'note',
              type: 'note'
            }
          ]
        },
        vrNum: {
          name: 'vr_num',
          label: '明细数量',
          items: [
            {
              label: '序号',
              name: 'id',
              type: 'ID',
              readOnly: true
            },
            {
              label: '打印型号',
              name: 'print_model',
              type: 'sgr'
            },
            {
              label: '打印品名',
              name: 'print_res',
              type: 'str'
            },
            {
              label: '品名',
              name: 'res_id',
              type: 'docKey'
            },
            {
              label: '桶数',
              name: 'pack_num',
              type: 'unum'
            },
            {
              label: '包装',
              name: 'per_pack_num',
              type: 'unum'
            },
            {
              label: '数量',
              name: 'num',
              type: 'unum'
            },
            {
              label: '价格',
              name: 'price',
              type: 'unum'
            },
            {
              label: '金额',
              name: 'amo',
              type: 'unum'
            },
            {
              label: '参考价',
              name: 'guide_price',
              type: 'price'
            }
          ],
          vrPf: {
            name: 'vr_pf',
            label: '明细配方',
            items: [
              {
                label: '序号',
                name: 'id',
                type: 'ID',
                readOnly: true
              },
              {
                label: '品名',
                name: 'res_id',
                type: 'docKey'
              },
              {
                label: '包装',
                name: 'per_pack_num',
                type: 'unum'
              },
              {
                label: '数量',
                name: 'num',
                type: 'unum'
              },
              {
                label: '价格',
                name: 'price',
                type: 'price'
              },
              {
                label: '金额',
                name: 'amo',
                type: 'amo'
              },
              {
                label: '参考价',
                name: 'guide_price',
                type: 'price'
              }
            ]
          }
        }
      }
    }
  },

  methods: {}
}
</script>
