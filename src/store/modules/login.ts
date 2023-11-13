import _axios from '@/api/https'
import URL_API from '@/api/interface'
import { ElMessage } from 'element-plus'
const state = {}
const getters = {}
const mutations = {
  SET_LOADING(state: any, data:boolean) {
    state.loading = data
  }
}

const actions = {
  fetchLogin: (context, params) => {
    return new Promise((resolve, reject) => {
      _axios().post(URL_API.login, params).then(res => {
        resolve(res.data)
      }).catch(error => {
        const { msg = '登录失败' } = error
        ElMessage({
          showClose: true,
          message: msg,
          type: 'error'
        })
        reject(error)
      })
    })
  },
  fetchLogout: (context) => {
    return new Promise((resolve, reject) => {
      _axios().post(URL_API.logout, {}).then(res => {
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
