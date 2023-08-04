import _axios from '@/api/https'
import URL_API from '@/api/interface'
import { formatAmount } from '@/utils'
import dayjs from 'dayjs'
const state = {
  userInfo: {}
}
const getters = {}

const mutations = {
  SET_USER_INFO(state: any, data: any) {
    state.userInfo = data
  }
}

const actions = {
  fetchUserInfo: (context, username) => {
    return new Promise((resolve, reject) => {
      _axios().get(URL_API.userGet, { params: { username } }).then(async res => {
        const data = res.data ?? []
        const age = dayjs().diff(data.onboarding_at ?? dayjs(), 'day')
        context.commit('SET_USER_INFO', {
          name: data.name ?? '',
          post: data.post ?? '',
          onboarding_at: data.onboarding_at ?? '',
          post_note: data.post_note ?? '',
          roster_name: data.roster_name ?? '',
          tags: data.tags ?? [],
          balance: formatAmount(data.balance ?? '0'),
          age: Math.round(age / 365)
        })
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
