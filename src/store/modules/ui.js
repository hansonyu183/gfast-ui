import { optApi, authApi, dictApi } from '@/api/erp/ui'
const state = {
  opt: {},
  auth: {
    vr: [],
    doc: [],
    dict: []
  }
}

const mutations = {
  SET_OPT_BY_NAME: (state, optName, data) => {
    state.opt[optName] = data
  },

  SET_ALL_OPT: (state, data) => {
    for (const key in data) {
      if (Object.hasOwnProperty.call(data, key)) {
        const element = data[key];
        state.opt[key] = element
      }
    }
  },
  SET_AUTH: (state, data) => {
    state.auth = data
  },
  SET_DICT: (state, data) => {
    state.dict = data
  },
}

const actions = {
  // 获取opt信息
  loadALLOpt({ commit }) {
    return new Promise((resolve, reject) => {
      optApi.getAllOpt().then(res => {
        commit('SET_ALL_OPT', res.data)
        resolve(res)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 获取opt信息
  loadOptByName({ commit }, optName) {
    return new Promise((resolve, reject) => {
      optApi.getByName(optName).then(res => {
        commit('SET_OPT_BY_NAME', optName, res.data)
        resolve(res)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 获取opt信息
  loadAuth({ commit, rootState }) {
    if (rootState.user.name) {
      return new Promise((resolve, reject) => {
        authApi.getAuth(rootState.user.name).then(res => {
          commit('SET_AUTH', res.data)
          resolve(res)
        }).catch(error => {
          reject(error)
        })
      })
    }
  },

  // 获取opt信息
  loadDict({ commit }) {
    return new Promise((resolve, reject) => {
      dictApi.getDict().then(res => {
        commit('SET_DICT', res.data)
        resolve(res)
      }).catch(error => {
        reject(error)
      })
    })
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
