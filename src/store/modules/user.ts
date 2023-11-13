import _axios from '@/api/https'
import URL_API from '@/api/interface'
import { ElMessage } from 'element-plus'
const state = {
  userList: [],
  jobs: [],
  params: {
    page: 1,
    size: -1
  },
  total: 0
}
const getters = {}

const mutations = {
  SET_USER_LIST(state: any, data: Array<any>) {
    state.userList = data
  },
  SET_JOBS(state: any, data: Array<any>) {
    state.jobs = data
  },
  SET_PARAMS(state:any, data) {
    state.params = data
  },
  SET_TOTAL(state:any, data) {
    state.total = data
  }
}

const actions = {
  fetchUserList: (context, params) => {
    return new Promise((resolve, reject) => {
      _axios().get(URL_API.userList, {
        params: {
          page: 0,
          size: -1
        }
      }).then(res => {
        const data = res?.data?.data ?? []
        const total = res?.data?.total ?? 0
        context.commit('SET_USER_LIST', data)
        context.commit('SET_TOTAL', total)

        resolve(res.data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  fetchUserAdd: (context, params) => {
    return new Promise((resolve, reject) => {
      _axios().post(URL_API.userAdd, params).then(res => {
        resolve(res.data)
      }).catch(error => {
        const { msg = '创建失败' } = error
        ElMessage({
          showClose: true,
          message: msg,
          type: 'error'
        })
        reject(error)
      })
    })
  },
  fetchUserSet: (context, params) => {
    return new Promise((resolve, reject) => {
      _axios().post(URL_API.userSet, params).then(res => {
        resolve(res.data)
      }).catch(error => {
        const { msg = '修改失败' } = error
        ElMessage({
          showClose: true,
          message: msg,
          type: 'error'
        })
        reject(error)
      })
    })
  },
  fetchUserDelete: (context, username) => {
    return new Promise((resolve, reject) => {
      _axios().delete(URL_API.userDelete, { params: { username } }).then(res => {
        resolve(res.data)
      }).catch(error => {
        const { msg = '删除失败' } = error
        ElMessage({
          showClose: true,
          message: msg,
          type: 'error'
        })
        reject(error)
      })
    })
  },
  fetchJobCategory: (context, params) => {
    return new Promise((resolve, reject) => {
      _axios().get(URL_API.jobCategory, {}).then(res => {
        resolve(res.data)
        const options = res.data ?? []
        context.commit('SET_JOBS', options)
      }).catch(error => {
        reject(error)
      })
    })
  },
  fetchPassword: (context, params) => {
    return new Promise((resolve, reject) => {
      _axios().post(URL_API.password, params).then(res => {
        resolve(res.data)
      }).catch(error => {
        const { msg = '修改失败' } = error
        ElMessage({
          showClose: true,
          message: msg,
          type: 'error'
        })
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
