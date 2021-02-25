<template>
  <doc-list dataType="account" :pageName="pageName" :pageDesc="pageDesc" />
</template>

<script>
import DocList from './components/docList.vue'
import Page from '../page'
export default {
  name: 'AccountList',
  components: {
    DocList
  },
  props: {},
  mixins: [Page],
  data() {
    return {
      pageName: 'accountList',
      desc: {
        label: '账户列表',
        name: 'accountList',
        form: {
          items: [
            {
              label: '科目',
              name: 'subject_id',
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
            label: '账户',
            name: 'account',
            items: [
              {
                label: '编号',
                name: 'no',
                type: 'no'
              },
              {
                label: '名称',
                name: 'name',
                type: 'name'
              },
              {
                label: '科目',
                name: 'subject_id',
                type: 'doc'
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
          name: 'accountEditor',
          label: '账户资料',
          form: {
            name: 'account',
            label: '账户',
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
                type: 'str'
              },
              {
                label: '科目',
                name: 'subject_id',
                type: 'doc'
              },
              {
                label: '备注',
                name: 'note',
                type: 'note'
              }
            ]
          },
          tables: []
        }
      }
    }
  }
}
</script>
