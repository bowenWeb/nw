<template>
  <div class="layout">
    <VHeader />
    <div class="container">
      <router-view />
    </div>
    <VFooter />
    <div class="layout-action">
      <div class="action" @click="goPage('/submit')">
        <img :src="require('@/assets/image/icon-submit.png')" alt="">
        <span>TagX</span>
      </div>
      <div class="action" @click="goPage('/proposal')">
        <el-badge class="mark" v-if="total" :value="total>99?'99+':total"></el-badge>
        <img :src="require('@/assets/image/icon-proposal.png')" alt="">
        <span>提案</span>
      </div>
      <div class="action" @click="goPage('/token')" v-if="role === 'admin'">
        <img :src="require('@/assets/image/icon-airdrop.png')" alt="">
        <span>空投</span>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, onMounted, computed } from 'vue'
import { useStore } from 'vuex'
import VHeader from '@/components/Header'
import VFooter from '@/components/Footer'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import _ from 'lodash'

export default defineComponent({
  name: 'VLayout',
  components: {
    VHeader,
    VFooter
  },
  setup() {
    const store = useStore()
    const router = useRouter()
    onMounted(() => {
      store.dispatch('global/fetchProposalList')
      store.dispatch('global/fetchUserStatus')
    })
    const goPage = (page) => {
      if (store.state.global.userInfo?.username) {
        router.push(page)
      } else {
        ElMessage({
          showClose: true,
          message: '请先登录',
          type: 'success'
        })
      }
    }
    return {
      role: computed(() => store.state.global.userInfo?.role),
      total: computed(() => store.state.global.proposalTotal),
      goPage
    }
  }
})
</script>

<style lang="scss" scoped>
.layout{
  width: 100%;
  min-width: 1200px;
  min-height: 100vh;
  overflow-x: auto;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  position: relative;
  background-color: #ffffff;
  .container{
    width: 100%;
    flex: 1;
    display: flex;
    flex-direction: column;
  }
.layout-action{
    width: 60px;
    padding: 20px 0;
    position: fixed;
    bottom: 20%;
    right: 25px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    background: #f4f4ff;
    border: 1px solid #000000;
    border-radius: 40px;
    row-gap: 10px;
    z-index: 111;
    transition: all 0.3s;
    .action{
      display: flex;
      flex-direction: column;
      cursor: pointer;
      transition: all 0.3s;
      position: relative;
      &:hover{
        transform: scale(1.1);
      }
      img{
        width: 32px;
        margin-bottom: 3px;
      }
      span{
        font-size: 12px;
        font-family: PingFang SC, PingFang SC-Regular;
        font-weight: 400;
        text-align: center;
        color: #000000;
        line-height: 14px;
      }
      .el-badge{
        position: absolute;
        top:-10px;
        left: 32px;
      }
    }

  }
}
</style>
