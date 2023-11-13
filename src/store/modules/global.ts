import _axios from '@/api/https'
import URL_API from '@/api/interface'
import { formatAmount } from '@/utils'
import _ from 'lodash-es'
import { ElMessage } from 'element-plus'
import dayjs from 'dayjs'

const state = {
  userInfo: {},
  tagsList: [],
  proposalTotal: 0,
  rosterNames: []
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
  },
  SET_ROSTER_NAMES(state: any, data: any) {
    state.rosterNames = data
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
  fetchUserStatus: (context) => {
    return new Promise((resolve, reject) => {
      _axios().get(URL_API.userStatus, {}).then(res => {
        const age = dayjs().diff(_.get(res, 'data.onboarding_at') ?? dayjs(), 'day')
        const Info = {
          username: _.get(res, 'data.name') ?? '',
          roster_name: _.get(res, 'data.roster_name') ?? '',
          balance: formatAmount(_.get(res, 'data.balance') ?? '0'),
          role: _.get(res, 'data.role') ?? '0',
          post: _.get(res, 'data.post') ?? '',
          post_note: _.get(res, 'data.post_note') ?? '',
          tags: _.get(res, 'data.tags') ?? [],
          age: Math.round(age / 365)
        }
        context.commit('SET_USER_INFO', Info)
        resolve(res.data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  fetchTagsList: (context, params) => {
    return new Promise((resolve, reject) => {
      _axios().get(URL_API.tagList, { params }).then(res => {
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
  fetchRosterNames: (context, post) => {
    return new Promise((resolve, reject) => {
      _axios().get(URL_API.infoList, { params: { post, page: 0, size: -1 } }).then(res => {
        const data = res.data ?? []
        const result:Array<any> = []
        data.forEach(n => {
          const child = n.child ?? []
          child.forEach(m => {
            result.push({
              label: m.roster_name ?? '',
              value: m.roster_name ?? ''
            })
          })
        })
        context.commit('SET_ROSTER_NAMES', result)
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
