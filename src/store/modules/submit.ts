import _axios from '@/api/https'
import URL_API from '@/api/interface'
import { formatAmount } from '@/utils'
import _ from 'lodash-es'

const state = {
  amount: '0'
}
const getters = {}

const mutations = {
  SET_AMOUNT(state: any, data: any) {
    state.amount = data
  }
}

const actions = {
  fetchTagAppraisal: (context, params) => {
    return new Promise((resolve, reject) => {
      _axios().post(URL_API.tagAppraisal, params).then(res => {
        const data = res.data ?? []
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  fetchTagsAmount: (context, params) => {
    return new Promise((resolve, reject) => {
      _axios().get(URL_API.tagAppraisalAmount, { params }).then(res => {
        const amount = _.get(res, 'data.amount')
        const str = formatAmount(amount)
        context.commit('SET_AMOUNT', str)
        resolve(res)
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
