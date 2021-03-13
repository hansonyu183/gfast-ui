<template>
  <doc-list dataType="eba" :pageName="pageName" :pageDesc="pageDesc" />
</template>

<script>
import DocList from './components/docList.vue'
import Page from '../page'
export default {
  name: 'EbaList',
  components: {
    DocList
  },
  props: {},
  mixins: [Page],
  data() {
    return {
      pageName: 'ebaList',
      desc: {
        label: '客户列表',
        name: 'ebaList',
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
                label: '数期',
                name: 'ebasq_id',
                type: 'doc'
              },
              {
                label: '账单日',
                name: 'bill_day',
                type: 'day'
              },
              {
                label: '付款日',
                name: 'pay_day',
                type: 'day'
              },
              {
                label: '返点价',
                name: 'hk_price',
                type: 'price'
              },
              {
                label: '加价',
                name: 'plus_price',
                type: 'price'
              },
              {
                label: '不含税',
                name: 'no_tax',
                type: 'bool'
              },
              {
                label: '最大欠款金额',
                name: 'owe_amount_limit',
                type: 'amo'
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
            ],
            label: '客户',
            name: 'eba'
          }
        ],
        editor: {
          name: 'ebaEditor',
          label: '客户资料',
          form: {
            name: 'eba',
            label: '客户',
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
                type: 'mail'
              },
              {
                label: '传真',
                name: 'fax',
                type: 'tel'
              },
              {
                label: '电话',
                name: 'tel',
                type: 'tel'
              },
              {
                label: '地址',
                name: 'address',
                type: 'str'
              },

              {
                label: '数期',
                name: 'ebasq_id',
                type: 'doc'
              },
              {
                label: '账单日',
                name: 'bill_day',
                type: 'day'
              },
              {
                label: '付款日',
                name: 'pay_day',
                type: 'day'
              },
              {
                label: '加价',
                name: 'plus_price',
                type: 'price'
              },
              {
                label: '返点价',
                name: 'hk_price',
                type: 'price'
              },
              {
                label: '不含税',
                name: 'no_tax',
                type: 'bool'
              },

              {
                label: '最大欠款金额',
                name: 'owe_amount_limit',
                type: 'uamo'
              },
              {
                label: '最多欠款天数',
                name: 'owe_time_limit',
                type: 'aint'
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
              label: '开票资料',
              items: [
                {
                  label: '开票客户',
                  name: 'inveba_id',
                  type: 'doc'
                }
              ]
            },
            {
              name: 'eba_formula',
              label: '客户配方',
              items: [
                {
                  label: '产品',
                  name: 'res_id',
                  type: 'doc'
                },
                {
                  label: '成分',
                  name: 'formula_res_id',
                  type: 'doc'
                },
                {
                  label: '数量',
                  name: 'per_num',
                  type: 'unum'
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
