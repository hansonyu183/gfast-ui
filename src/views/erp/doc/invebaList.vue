<template>
  <doc-list dataType="inveba" :pageName="pageName" :pageDesc="pageDesc" />
</template>

<script>
import DocList from './components/docList.vue'
import Page from '../page'
export default {
  name: 'InvebaList',
  components: {
    DocList
  },
  props: {},
  mixins: [Page],
  data() {
    return {
      pageName: 'invebaList',
      desc: {
        label: '客户税务资料',
        name: 'invebaList',
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
            name: 'inveba',
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
                label: '银行',
                name: 'bank',
                type: 'str'
              },
              {
                label: '地址电话',
                name: 'address',
                type: 'tel'
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
          name: 'invebaEditor',
          label: '开票资料',
          form: {
            name: 'inveba',
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
                label: '银行',
                name: 'bank',
                type: 'str'
              },
              {
                label: '地址电话',
                name: 'address',
                type: 'tel'
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
              name: 'fk_eba_inveba',
              label: '相关客户',
              items: [
                {
                  label: '所属客户',
                  name: 'eba_id',
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
