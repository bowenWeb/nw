import _axios from '@/api/https'
import URL_API from '@/api/interface'

const state = {
  jobs: [],
  rankList: [],
  allList: []
}
const getters = {

}
const mutations = {
  SET_JOBS(state: any, data: Array<any>) {
    state.jobs = data
  },
  SET_RANK_LIST(state: any, data:Array<any>) {
    state.rankList = data
  },
  SET_ALL_LIST(state: any, data:Array<any>) {
    state.allList = data
  }

}

const actions = {
  fetchInfo: (context, post) => {
    return new Promise((resolve, reject) => {
      _axios().get(URL_API.infoList, { params: { post, page: 0, size: -1 } }).then(res => {
        const data = res.data ?? []
        context.commit('SET_JOBS', data)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  fetchAllList: (context, days) => {
    return new Promise((resolve, reject) => {
      _axios().get(URL_API.popularTop, { params: { num: -1 } }).then(res => {
        context.commit('SET_ALL_LIST', res.data ?? [])
        resolve(res.data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  fetchRankList: (context, days) => {
    return new Promise((resolve, reject) => {
      _axios().get(URL_API.popularTop, { params: { num: 20 } }).then(res => {
        context.commit('SET_RANK_LIST', res.data ?? [])
        resolve(res.data)
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
