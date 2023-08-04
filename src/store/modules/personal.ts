import _axios from '@/api/https'
import _ from 'lodash-es'
const state = {
  loading: false,
  count: 1,
  statusList: [],
  json: []
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
  }
}

const actions = {

}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
