<template>
  <doc-list dataType="res" :pageName="pageName" :pageDesc="pageDesc" />
</template>

<script>
import DocList from './components/docList.vue'
import Page from '../page'
export default {
  name: 'ResList',
  components: {
    DocList
  },
  mixins: [Page],
  data() {
    return {
      pageName: 'resList',
      desc: {
        label: '产品列表',
        name: 'resList',
        form: {
          items: [
            {
              label: '产品类别',
              name: 'reskind_id',
              type: 'doc'
            },
            {
              label: '档案状态',
              name: 'state_id',
              type: 'doc'
            }
          ],
          label: '查询',
          name: 'query'
        },
        tables: [
          {
            items: [
              {
                label: '编号',
                name: 'no',
                type: 'unknown'
              },
              {
                label: '名称',
                name: 'name',
                type: 'unknown'
              },
              {
                label: '型号',
                name: 'model',
                type: 'unknown'
              },
              {
                label: '包装',
                name: 'pack_num',
                type: 'number'
              },
              {
                label: '单位',
                name: 'unit_id',
                type: 'doc'
              },
              {
                label: '产品类别',
                name: 'reskind_id',
                type: 'doc'
              },
              {
                label: '下限数量',
                name: 'floor_num',
                type: 'number'
              },
              {
                label: '期初数量',
                name: 'init_num',
                type: 'number'
              },
              {
                label: '期初价格',
                name: 'init_price',
                type: 'price'
              },
              {
                label: '期初金额',
                name: 'init_amo',
                type: 'amo'
              },
              {
                label: '档案状态',
                name: 'state_id',
                type: 'doc'
              }
            ],
            label: '产品',
            name: 'res'
          }
        ],
        editor: {
          name: 'resEditor',
          label: 'resEditor',
          form: {
            name: 'res',
            label: '产品',
            items: [
              {
                label: '名称',
                name: 'name',
                type: 'name'
              },
              {
                label: '编号',
                name: 'no',
                type: 'no'
              },
              {
                label: '拼音码',
                name: 'py',
                type: 'py'
              },
              {
                label: '型号',
                name: 'model',
                type: 'model'
              },
              {
                label: '包装',
                name: 'pack_num',
                type: 'unum'
              },
              {
                label: '产品类别',
                name: 'reskind_id',
                type: 'doc'
              },
              {
                label: '单位',
                name: 'unit_id',
                type: 'doc'
              },
              {
                label: '下限数量',
                name: 'floor_num',
                type: 'unum'
              },
              {
                label: '备注',
                name: 'note',
                type: 'note'
              }
            ]
          },
          tables: [
            {
              name: 'fk_res_invres',
              label: '开票资料',
              items: [
                {
                  label: '开票品名',
                  name: 'invres_id',
                  type: 'doc'
                }
              ]
            },
            {
              name: 'res_bom',
              label: '配方',
              items: [
                {
                  label: '配方产品',
                  name: 'bom_res_id',
                  type: 'doc'
                },
                {
                  label: '数量%',
                  name: 'per_num',
                  type: 'num'
                }
              ]
            }
          ]
        }
      }
    }
  }
}
</script>
