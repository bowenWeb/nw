import _axios from '@/api/https'
import URL_API from '@/api/interface'
const state = {}
const getters = {}
const mutations = {
  SET_LOADING(state: any, data:boolean) {
    state.loading = data
  }
}

const actions = {
  fetchTagsAdd: (context, params) => {
    return new Promise((resolve, reject) => {
      _axios().post(URL_API.tagManage, params).then(res => {
        resolve(res.data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  fetchTagsDel: (context, params) => {
    return new Promise((resolve, reject) => {
      _axios().post(URL_API.tagManage, params).then(res => {
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
