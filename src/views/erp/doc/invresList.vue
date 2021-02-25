<template>
  <doc-list dataType="invres" :pageName="pageName" :pageDesc="pageDesc" />
</template>

<script>
import DocList from './components/docList.vue'
import Page from '../page'
export default {
  name: 'InvresList',
  components: {
    DocList
  },
  props: {},
  mixins: [Page],
  data() {
    return {
      pageName: 'invresList',
      desc: {
        label: '产品税务资料列表',
        name: 'invresList',
        form: {
          items: [
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
            label: '开票资料',
            name: 'invres',
            items: [
              {
                label: '税号',
                name: 'no',
                type: 'no'
              },
              {
                label: '名称',
                name: 'name',
                type: 'name'
              },
              {
                label: '型号',
                name: 'model',
                type: 'str'
              },
              {
                label: '期初数',
                name: 'init_num',
                type: 'num'
              },
              {
                label: '期末数',
                name: 'end_num',
                type: 'num'
              },
              {
                label: '备注',
                name: 'note',
                type: 'note'
              },
              {
                label: '档案状态',
                name: 'state_id',
                type: 'doc'
              }
            ]
          }
        ],
        editor: {
          name: 'invresEditor',
          label: '开票资料',
          form: {
            name: 'invres',
            label: '开票资料',
            items: [
              {
                label: '税号',
                name: 'no',
                type: 'no'
              },
              {
                label: '名称',
                name: 'name',
                type: 'name'
              },
              {
                label: '拼音码',
                name: 'py',
                type: 'py'
              },
              {
                label: '型号',
                name: 'model',
                type: 'str'
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
              label: '相关产品',
              items: [
                {
                  label: '所属产品',
                  name: 'res_id',
                  type: 'doc'
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
