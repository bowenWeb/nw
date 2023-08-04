import _axios from '@/api/https'
import URL_API from '@/api/interface'

const state = {
  jobs: [],
  rankList: []
}
const getters = {

}
const mutations = {
  SET_JOBS(state: any, data: Array<any>) {
    state.jobs = data
  },
  SET_RANK_LIST(state: any, data:Array<any>) {
    state.rankList = data
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
  fetchPopularList: (context, days) => {
    return new Promise((resolve, reject) => {
      _axios().get(URL_API.popularList, { params: { days } }).then(res => {
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
