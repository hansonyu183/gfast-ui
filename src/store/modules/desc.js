import { getDesc, addDesc, delDesc, saveDesc } from '@/api/erp/desc'

const state = {
  canModifyUI: false,
  user:
  {/*
    pages: [
      {
        name: 'ebaList_page',
        type: 'page',
        forms: [
          {
            name: 'query_form',
            label: '查询参数',
            items: [
              {
                name: 'name',
                label: '名称',
                type: 'string'
              },
              {
                name: 'emp_id',
                label: '员工',
              },
              {
                name: 'address',
                label: '地址',
              }
            ],
          },//form:query
          {
            name: 'edit',
            label: '编辑',
            items: [
              {
                name: 'date',
                label: '日期'
              },
            ],
          }//form:edit
        ],//forms
        tables: [
          {
            name: 'eba',
            label: '客户',
            cols: [

            ]
          }//table:eba
        ]//tables
      }//page:ebaList
    ],*/
  },

  label: {
    id: '编号',
    res_id: '产品',
    name: '名称',
    amo: '金额',
    num: '数量',
    price: '价格',
    address: '地址'
  },

  autoItem: {
    id: {
      type: 'doc',
      label: 'ID',
    },
    name: {
      type: 'string',
      label: '名称',
    },
    date: {
      type: 'date',
      label: '日期',
    },
    month: {
      type: 'month',
      label: '月份',
    },
    note: {
      type: 'note',
      label: '摘要',
    },
    memo: {
      type: 'memo',
      label: '备注',
    },
    num: {
      type: 'number',
      label: '数量',
    },
    amo: {
      type: 'amo',
      label: '金额',
    },
    price: {
      type: 'price',
      label: '价格',
    },
    str: {
      type: 'string',
      label: '',
    },
    address: {
      type: 'string',
      label: '地址'
    },
    form: {
      type: 'form',
      label: '表单'
    },
    table: {
      type: 'table',
      label: '表格'
    },
    page: {
      type: 'page',
      label: '页面'
    }
  },
}

const mutations = {
  SET_AUTO_ITEM: (state, desc) => {
    state.autoItem = desc
  },
  SET_LABEL: (state, desc) => {
    state.user = desc
  },
  SET_USER: (state, desc) => {
    state.user = desc
  },
  SET_ROLE: (state, desc) => {
    state.role = desc
  },

  SET_ALL: (state, desc) => {
    state.autoItem = desc
    state.user = desc
    state.role = desc
    state.autoDesc = desc.autoDesc
    state.useDesc = desc.useDesc
  },
  SWITCH_CAN_MODIFY_UI: (state) => {
    state.canModifyUI = !state.canModifyUI
  },
  SAVE_LABEL: (state, key, label) => {
    state.label[key] = label
  },
  SAVE_USER_PAGE: (state, desc) => {
    const i = state.user.pages.findIndex((obj) => obj.name === desc.name)
    if (i === -1) {
      state.user.pages.push(desc)
    } else {
      state.user.pages[i] = desc
    }
  },
}

const actions = {
  loadLabel({ commit }) {
    return new Promise((resolve, reject) => {
      getDesc('label').then(res => {
        commit('SET_LABEL', JSON.parse(res.data.data))
        resolve(res)
      }).catch(error => {
        reject(error)
      })
    })
  },

  loadUser({ commit }, userName) {
    return new Promise((resolve, reject) => {
      getDesc(userName).then(res => {
        let desc = JSON.parse(res.data.data)
        console.log(desc)
        commit('SET_USER', desc)//fillDesc(desc, state.autoItem, state.label)
        resolve(res)
      }).catch(error => {
        reject(error)
      })
    })
  },
  saveLabel({ commit }, key, label) {
    commit('SAVE_LABEL', key, label)
  },
  switchCanModifyUI({ commit }) {
    commit('SWITCH_CAN_MODIFY_UI')
  },
  saveUserPageDesc({ commit }, desc) {
    commit('SAVE_USER_PAGE', desc)
  },
  saveUserDesc({ commit }, desc) {
    commit('SET_USER', desc)
  },
}

function fillDesc(desc, itemDesc, labelDesc) {
  let ud = desc
  fillItems(ud, itemDesc, labelDesc)
  return ud
}

function fillItems(desc, itemDesc, labelDesc) {
  for (const t in desc) {
    const tp = Object.prototype.toString.call(desc[t])
    if (tp === '[object Array]') {
      fillItems(desc[t], itemDesc, labelDesc);
    } else if (tp === '[object Object]') {
      if (desc[t].name) {
        const suf = desc[t].name.substr(desc[t].name.lastIndexOf("_") + 1)
        if (!desc[t].type) {
          desc[t]['type'] = desc[t]['type'] ?? itemDesc[suf]?.type ?? 'unknown'
        }
        if (!desc[t].label) {
          desc[t]['label'] = labelDesc[desc[t].name] ?? itemDesc[suf]?.label ?? '未命名'
        } else {//更新词典
          labelDesc[desc[t].name] = desc[t].label
        }
      }
      fillItems(desc[t], itemDesc, labelDesc);
    }
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
