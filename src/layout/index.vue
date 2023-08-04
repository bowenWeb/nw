<template>
  <div class="layout">
    <VHeader />
    <div class="container">
      <router-view />
    </div>
    <VFooter />
    <div class="layout-action">
      <span @click="goPage('/submit')">评价</span>
      <span @click="goPage('/proposal')">
        提案
        <el-badge class="mark" v-if="total" :value="total>99?'99+':total" />
      </span>
      <span @click="goPage('/token')">奖励</span>
    </div>
  </div>
</template>

<script>
import { defineComponent, onMounted, computed } from 'vue'
import { useStore } from 'vuex'
import VHeader from '@/components/Header'
import VFooter from '@/components/Footer'
import { useRouter } from 'vue-router'

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
      store.dispatch('global/fetchUserInfo')
    })
    const goPage = (page) => {
      router.push(page)
    }
    return {
      total: computed(() => store.state.global.proposalTotal),
      goPage
    }
  }
})
</script>

<style lang="scss" scoped>
.layout{
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  position: relative;
  background-color: #ffffff;
  .container{
    width: 100%;
    flex: 1;
  }
.layout-action{
    position: fixed;
    top: 40%;
    right: 25px;
    display: flex;
    align-items: center;
    flex-direction: column;
    background-color: rgba(0, 0, 0, 0.3);
    row-gap: 20px;
    padding: 30px 10px;
    border-radius: 30px;
    z-index: 111;
    span{
      color: #333;
      cursor: pointer;
      position: relative;
      .el-badge{
        position: absolute;
        top:-10px;
        left: 32px;
      }
    }
  }
}
</style>
