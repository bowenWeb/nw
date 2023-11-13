import _axios from '@/api/https'
import URL_API from '@/api/interface'
import _ from 'lodash-es'
const state = {
  loading: false,
  count: 1,
  statusList: [],
  json: [],
  params: {
    page: 1,
    size: 20
  },
  total: 0,
  tokenParams: {
    page: 1,
    size: 20
  },
  tokenTotal: 0,
  tokenList: [],
  appraisals: []
}
const getters = {}

const mutations = {
  SET_STATUS(state: any, data: Array<any>) {
    state.statusList = data
  },
  SET_JSON(state: any, data) {
    state.json = data
  },
  SET_LOADING(state: any, data:boolean) {
    state.loading = data
  },

  SET_PARAMS(state:any, data) {
    state.params = data
  },
  SET_TOTAL(state:any, data) {
    state.total = data
  },
  SET_APPRAISALS(state:any, data) {
    state.appraisals = data
  },
  SET_TOKEN_PARAMS(state:any, data) {
    state.tokenParams = data
  },
  SET_TOKEN_LIST(state:any, data) {
    state.tokenList = data
  },
  SET_TOKEN_TOTAL(state:any, data) {
    state.tokenTotal = data
  }

}

const actions = {
  fetchAppraisals: (context, params) => {
    return new Promise((resolve, reject) => {
      _axios().get(URL_API.appraisals, {
        params: {
          page: params.page - 1,
          size: params.size
        }
      }).then(res => {
        const data = res?.data?.data ?? []
        const total = res?.data?.total ?? 0
        context.commit('SET_TOTAL', total)
        context.commit('SET_APPRAISALS', data)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  fetchTokenList: (context, tokenParams) => {
    return new Promise((resolve, reject) => {
      _axios().get(URL_API.tokenList, {
        params: {
          page: tokenParams.page - 1,
          size: tokenParams.size
        }
      }).then(res => {
        const data = res?.data?.data ?? []
        const total = res?.data?.total ?? 0
        context.commit('SET_TOKEN_TOTAL', total)
        context.commit('SET_TOKEN_LIST', data)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  }

}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
