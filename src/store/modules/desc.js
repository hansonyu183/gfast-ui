import { getDesc, addDesc, delDesc, saveDesc } from '@/api/erp/desc'

const state = {
  canModifyUI: false,
  user:
  {
  },
  tables: {

  },
  label: {
  },

  autoItem: {
    id: {
      type: 'doc',
      label: 'ID',
    },
    name: {
      type: 'name',
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
      type: 'num',
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
    if (desc) {
      state.label = desc
    }
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
  SAVE_LABEL_BY_KEY: (state, key, label) => {
    state.label[key] = label
  },
  SAVE_USER_PAGE: (state, desc) => {
    if (!state.user.pages) {
      state.user['pages'] = [s]
    }
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
        commit('SET_USER', desc)//fillDesc(desc, state.autoItem, state.label)
        resolve(res)
      }).catch(error => {
        reject(error)
      })
    })
  },

  makeLabel({ commit }, desc) {
    commit('SET_LABEL', mkLabel(state.label, desc))
  },
  saveLabelByKey({ commit }, key, label) {
    commit('SAVE_LABEL_BY_KEY', key, label)
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
/*
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
}*/

function mkLabel(labelDesc, desc) {
  let lb = labelDesc
  loopLabel(lb, desc)
  return lb
}

function loopLabel(labelDesc, desc) {
  for (const t in desc) {
    const tp = Object.prototype.toString.call(desc[t])
    if (tp === '[object Array]') {
      mkLabel(labelDesc, desc[t]);
    } else if (tp === '[object Object]') {
      if (!labelDesc[desc[t].name] && desc[t].label) {
        labelDesc[desc[t].name] = desc[t].label
      }
      mkLabel(labelDesc, desc[t]);
    }
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
