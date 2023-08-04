import _axios from '@/api/https'
import URL_API from '@/api/interface'
import { formatAmount } from '@/utils'
import _ from 'lodash-es'

const state = {
  userInfo: {},
  tagsList: [],
  proposalTotal: 0
}
const getters = {}

const mutations = {
  SET_USER_INFO(state:any, data) {
    state.userInfo = data
  },
  SET_TAGS_LIST(state: any, data: any) {
    state.tagsList = data
  },
  SET_PROPOSAL_TOTAL(state: any, data: any) {
    state.proposalTotal = data
  }
}

const actions = {
  fetchProposalList: (context) => {
    return new Promise((resolve, reject) => {
      _axios().get(URL_API.proposalList, {
        params: {
          active: true,
          page: 0,
          size: -1
        }
      }).then(res => {
        const data = res?.data?.data ?? []
        const voted = data.filter(n => !n.voted)
        context.commit('SET_PROPOSAL_TOTAL', voted.length)
      }).catch(error => {
        reject(error)
      })
    })
  },
  fetchUserInfo: (context, username) => {
    return new Promise((resolve, reject) => {
      _axios().get(URL_API.userGet, {
        params: { username }
      }).then(res => {
        const Info = {
          username: _.get(res, 'data.name') ?? '',
          roster_name: _.get(res, 'data.roster_name') ?? '',
          balance: formatAmount(_.get(res, 'data.balance') ?? '0'),
          role: _.get(res, 'data.role') ?? '0',
          post: _.get(res, 'data.post') ?? '',
          post_note: _.get(res, 'data.post_note') ?? '',
          tags: _.get(res, 'data.tags') ?? []
        }
        context.commit('SET_USER_INFO', Info)
        resolve(res.data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  fetchTagsList: (context) => {
    return new Promise((resolve, reject) => {
      _axios().get(URL_API.tagList, { params: { tag_type: 0 } }).then(res => {
        const data = res.data ?? []
        context.commit('SET_TAGS_LIST', data)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  fetchAirdrop: (context, params) => {
    return new Promise((resolve, reject) => {
      _axios().post(URL_API.airdrop, params).then(res => {
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
