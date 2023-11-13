import _axios from '@/api/https'
import URL_API from '@/api/interface'
import { ElMessage } from 'element-plus'

const state = {
  proposalList: [],
  proposal: {},
  params: {
    active: true,
    page: 1,
    size: 20
  },
  total: 0
}
const getters = {}

const mutations = {
  SET_PARAMS(state: any, data: any) {
    state.params = data
  },
  SET_TOTAL(state: any, data: any) {
    state.total = data
  },
  SET_PROPOSAL_LIST(state: any, data: Array<any>) {
    state.proposalList = data
  },
  SET_PROPOSAL(state: any, data: any) {
    state.proposal = data
  }
}

const actions = {
  fetchProposalList: (context, params) => {
    return new Promise((resolve, reject) => {
      _axios().get(URL_API.proposalList, {
        params: {
          active: params.active,
          page: params.page - 1,
          size: params.size
        }
      }).then(res => {
        const data = res?.data?.data ?? []
        const total = res?.data?.total ?? 0
        console.log(data, 'cdd')
        context.commit('SET_PROPOSAL_LIST', data)
        context.commit('SET_TOTAL', total)
      }).catch(error => {
        reject(error)
      })
    })
  },
  fetchProposal: (context, id) => {
    return new Promise((resolve, reject) => {
      _axios().get(URL_API.proposalGet, { params: { id } }).then(res => {
        const options = res.data ?? []
        resolve(options)
      }).catch(error => {
        reject(error)
      })
    })
  },

  fetchProposalAdd: (context, params) => {
    return new Promise((resolve, reject) => {
      _axios().post(URL_API.proposalAdd, params).then(res => {
        const data = res.data ?? []
        resolve(data)
      }).catch(error => {
        const { msg = '失败' } = error
        ElMessage({
          showClose: true,
          message: msg,
          type: 'error'
        })
        reject(error)
      })
    })
  },

  fetchProposalVote: (context, id) => {
    return new Promise((resolve, reject) => {
      _axios().post(URL_API.proposalVote, { id }).then(res => {
        const data = res.data ?? []
        resolve(data)
      }).catch(error => {
        const { msg = '失败' } = error
        ElMessage({
          showClose: true,
          message: msg,
          type: 'error'
        })
        reject(error)
      })
    })
  },

  fetchProposalTag: (context, id) => {
    return new Promise((resolve, reject) => {
      _axios().post(URL_API.proposalVote, { params: { id } }).then(res => {
        const data = res.data ?? []
        resolve(data)
      }).catch(error => {
        const { msg = '失败' } = error
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
