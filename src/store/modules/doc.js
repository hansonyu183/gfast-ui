import { getDocOption } from '@/api/erp/doc'

const state = {
    /*  eba: [],
      sup: [],
      company: [],
      res: [],
      emp: [],
      account: [],
      subject: [],
      vtype: [],
      unit: [],
      brand: [],
      reskind: [],
      state: [],
      act: [],
      user: [],
      ebasq: [],
      invres: [],*/
}

const mutations = {
    SET_EBA: (state, data) => {
        state.eba = data
        state.unit = [...state.eba, ...state.sup]
    },
    SET_SUP: (state, data) => {
        state.sup = data
        state.unit = [...state.eba, ...state.sup]
    },
    SET_RES: (state, data) => {
        state.res = data
    },
    SET_EMP: (state, data) => {
        state.emp = data
    },
    SET_ACCOUNT: (state, data) => {
        state.account = data
    },
    SET_SUBJECT: (state, data) => {
        state.subject = data
    },
    SET_VTYPE: (state, data) => {
        state.vtype = data
    },
    SET_ALL: (state, data) => {
        for (const key in data) {
            if (Object.hasOwnProperty.call(data, key)) {
                const element = data[key];
                state[key] = element
            }
        }/*
        state.eba = data.eba
        state.sup = data.sup
        state.res = data.res
        state.emp = data.emp
        state.account = data.account
        state.subject = data.subject
        state.vtype = data.vtype
        state.company = [...state.eba, ...state.sup]
        state.brand = data.brand
        state.reskind = data.reskind
        state.state = data.state
        state.act = data.act
        state.unit = data.unit
        state.user = data.user
        state.ebasq = data.ebasq
        state.invres = data.invres*/
    },
}

const actions = {
    // 获取ERP信息
    loadALLDoc({ commit }, docName) {
        return new Promise((resolve, reject) => {
            getDocOption(docName).then(res => {
                commit('SET_' + docName, res.data)
                resolve(res)
            }).catch(error => {
                reject(error)
            })
        })
    },
}

/*

*/

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
