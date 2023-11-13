<template>
  <div class="detail">
    <div class="detail-banner">
      <img class="img" :src="require('@/assets/image/cloud-bg-4.png')" alt="">
    </div>
    <div class="detail-content content-width">
      <div class="logo">{{ userInfo.roster_name?.substring(0,2) }}</div>
      <div class="detail-info">
        <div class="name">{{userInfo.roster_name}}</div>
        <div class="tags">收到的TagX数量：{{ userInfo.tags?.length }}</div>
        <div class="row">
          <div class="balance">
            <div class="label">Token</div>
            <div class="value">{{userInfo.balance}} nw</div>
          </div>
          <div class="year">
            <div class="label">司龄</div>
            <div class="value">{{userInfo.age}}年</div>
          </div>
        </div>
      </div>

      <div class="title">TagX列表 </div>
      <div class="cards">
        <div class="cards-item" v-for="item in userInfo.tags" :key="item">
          <Card
            :url="`http://192.168.1.62:30700/images/${userInfo.post_note}.png`"
            :post="item.tag"
            :approve="item.approve"
            :from="name"
            :to="userInfo.roster_name"
            :balance="balance"
            :amount="''"
          ></Card>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { defineComponent, ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Card from '@/components/Detail/Card'
import { useStore } from 'vuex'
import { formatDate } from '@/utils/date'
import { truncateString } from '@/utils'

export default defineComponent({
  name: 'detail-page',
  components: { Card },
  setup() {
    const visible = ref(false)
    const store = useStore()
    const router = useRouter()
    const route = useRoute()
    const id = route.params?.id
    onMounted(() => {
      store.dispatch('detail/fetchUserInfo', id)
    })

    const userInfo = computed(() => store.state.detail.userInfo)
    const name = computed(() => store.state.global.userInfo.roster_name)
    const balance = computed(() => store.state.global.userInfo.balance)
    const goPage = (page) => {
      router.push(page)
    }

    return {
      visible,
      formatDate,
      userInfo,
      name,
      truncateString,
      goPage,
      balance,
      checked: true
    }
  }
})
</script>
<style lang="scss" scoped>
.detail {
  .detail-banner{
    font-size: 0;
    width: 100%;
    height: 370px;
    background: linear-gradient(180deg,#fefffe, #dfe1ff 55%, #c9bdff 97%);
    position: relative;
    .img{
      width: 70%;
      max-width: 1200px;
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-40%);
    }
  }
  .detail-content{
    position: relative;
    padding-top: 70px;
    .logo{
      width: 140px;
      height: 140px;
      background: #000000;
      border-radius: 10px;
      font-size: 50px;
      font-family: PingFang SC, PingFang SC-Medium;
      font-weight: 500;
      text-align: center;
      color: #868bff;
      line-height: 140px;
      position: absolute;
      top: -105px;
      left: 20px;
    }
    .detail-info{
      margin-bottom: 60px;
      position: relative;
      &::after{
        content: '';
        width: 100%;
        height: 1px;
        background: #e4e8eb;
        position: absolute;
        bottom: -30px;
        left: 0;
      }
      .name{
        font-size: 25px;
        font-family: WDCH, WDCH-Regular;
        font-weight: 400;
        color: #000000;
        line-height: 30px;
        margin-bottom: 10px;
      }
      .tags{
        font-size: 14px;
        font-family: PingFang SC, PingFang SC-Medium;
        font-weight: 500;
        color: #656e76;
        line-height: 20px;
        margin-bottom: 30px;
      }
      .row{
        display: flex;
        align-items: center;
        column-gap: 80px;
        .year,.position,.balance{
          .label,.value{
            font-size: 14px;
            font-family: PingFang SC, PingFang SC-Medium;
            font-weight: 500;
            text-align: left;
            color: #000000;
            line-height: 20px;
          }
        }
      }
    }
    .chart-tags{
      display: flex;
      justify-content: flex-start;
      column-gap: 180px;
      margin-bottom: 80px;
      .chart{
        width: 500px;
        height: 500px;
        border:1px solid #333;
        position: relative;
        .ai{
          width: 600px;
        }
        .left-tags{
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          display: flex;
          flex-direction: column;
        }
      }
      .list-wrap{
       .list-title{
        width: 360px;
        font-size: 25px;
        font-family: WDCH, WDCH-Regular;
        font-weight: 400;
        color: #000000;
        line-height: 30px;
        margin-bottom: 30px;
       }
       .no-data{
        width: 360px;
        height: 50px;
        background: #ffffff;
        border: 0.5px solid rgba(151,151,151,0.25);
        border-radius: 8px;
        box-shadow: 0px 1px 20px 0px rgba(0,0,0,0.05);
        margin-bottom: 5px;
        padding: 0 30px;
        font-family: PingFang SC, PingFang SC-Medium;
        font-weight: 500;
        color: #000000;
        line-height: 50px;
        .submit{
          cursor: pointer;
          color: #1667ff;
          margin: 0 3px;
        }
       }
        :deep(.el-scrollbar){
          .list-item{
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 360px;
            height: 50px;
            background: #ffffff;
            border: 0.5px solid rgba(151,151,151,0.25);
            border-radius: 8px;
            box-shadow: 0px 1px 20px 0px rgba(0,0,0,0.05);
            margin-bottom: 5px;
            padding: 0 30px;
            font-family: PingFang SC, PingFang SC-Medium;
            font-weight: 500;
            color: #000000;
          }
        }

      }
    }
    .title{
        width: 360px;
        font-size: 25px;
        font-family: WDCH, WDCH-Regular;
        font-weight: 400;
        color: #000000;
        line-height: 30px;
        margin-bottom: 20px;
    }
    .cards{
      display: grid;
      grid-template-columns: repeat(6,1fr);
      gap: 20px;
      margin-bottom: 100px;
      .cards-item{

      }
    }
  }
}
</style>
