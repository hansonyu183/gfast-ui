<template>
  <doc-list dataType="emp" :pageName="pageName" :pageDesc="pageDesc" />
</template>

<script>
import DocList from './components/docList.vue'
import Page from '../page'
export default {
  name: 'EmpList',
  components: {
    DocList
  },
  props: {},
  mixins: [Page],
  data() {
    return {
      pageName: 'empList',
      desc: {
        label: '员工列表',
        name: 'empList',
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
            label: '员工',
            name: 'emp',
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
                label: '手机',
                name: 'mobile',
                type: 'mob'
              },
              {
                label: '电话',
                name: 'tel',
                type: 'tel'
              },
              {
                label: 'QQ',
                name: 'qq',
                type: 'qq'
              },
              {
                label: 'E-Mail',
                name: 'mail',
                type: 'mail'
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
          name: 'empEditor',
          label: '员工资料',
          form: {
            name: 'emp',
            label: '员工',
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
                label: '拼音码',
                name: 'py',
                type: 'str'
              },
              {
                label: '手机',
                name: 'mobile',
                type: 'mob'
              },
              {
                label: '电话',
                name: 'tel',
                type: 'tel'
              },
              {
                label: 'QQ',
                name: 'qq',
                type: 'qq'
              },
              {
                label: 'E-Mail',
                name: 'mail',
                type: 'mail'
              },
              {
                label: '备注',
                name: 'note',
                type: 'note'
              }
            ]
          },
          //tables: []
        }
      }
    }
  }
}
</script>
