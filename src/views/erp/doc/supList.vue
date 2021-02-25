<template>
  <doc-list dataType="sup" :pageName="pageName" :pageDesc="pageDesc" />
</template>

<script>
import DocList from './components/docList.vue'
import Page from '../page'
export default {
  name: 'SupList',
  components: {
    DocList
  },
  mixins: [Page],
  mounted() {},
  data() {
    return {
      pageName: 'supList',
      desc: {
        name: 'sup',
        label: '供应商',
        form: {
          items: [
            {
              label: '员工',
              name: 'emp_id',
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
                type: 'no'
              },
              {
                label: '名称',
                name: 'name',
                type: 'name'
              },
              {
                label: '员工',
                name: 'emp_id',
                type: 'doc'
              },
              {
                label: '联系人',
                name: 'linkman',
                type: 'str'
              },
              {
                label: '电话',
                name: 'tel',
                type: 'tel'
              },
              {
                label: '开户行',
                name: 'bank',
                type: 'str'
              },
              {
                label: '户名',
                name: 'bank_name',
                type: 'str'
              },
              {
                label: '账号',
                name: 'bank_account',
                type: 'account'
              },
              {
                label: '最大欠款金额',
                name: 'owe_amount_limit',
                type: 'uamo'
              },
              {
                label: '最多欠款天数',
                name: 'owe_time_limit',
                type: 'uint'
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
          name: 'supEditor',
          label: '供应商编辑',
          form: {
            name: 'sup',
            label: '供应商',
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
                label: '员工',
                name: 'emp_id',
                type: 'doc'
              },
              {
                label: '联系人',
                name: 'linkman',
                type: 'str'
              },
              {
                label: '邮箱',
                name: 'mail',
                type: 'email'
              },
              {
                label: '电话',
                name: 'tel',
                type: 'tel'
              },
              {
                label: '传真',
                name: 'fax',
                type: 'tel'
              },
              {
                label: '地址',
                name: 'address',
                type: 'str'
              },
              {
                label: '最大欠款金额',
                name: 'owe_amount_limit',
                type: 'uamo'
              },
              {
                label: '最多欠款天数',
                name: 'owe_time_limit',
                type: 'uint'
              },
              {
                label: '开户行',
                name: 'bank',
                type: 'str'
              },
              {
                label: '户名',
                name: 'bank_name',
                type: 'str'
              },
              {
                label: '账号',
                name: 'bank_account',
                type: 'account'
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
