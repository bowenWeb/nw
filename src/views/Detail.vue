<template>
  <div class="detail">
    <div class="detail-banner">
      <img class="banner" :src="require('@/assets/image/dog-bg.png')" alt="">
    </div>
    <div class="detail-content content-width">
      <div class="logo">{{ userInfo.roster_name?.substring(0,2) }}</div>
      <div class="detail-info">
        <div class="name">{{userInfo.roster_name}}</div>
        <div class="tags">收到的标签数量：{{ userInfo.tags?.length }}</div>
        <div class="row">
          <div class="balance">
            <div class="label">Token</div>
            <div class="value">{{userInfo.balance}} nw</div>
          </div>
          <div class="position">
            <div class="label">职位</div>
            <div class="value">{{userInfo.post}}</div>
          </div>
          <div class="year">
            <div class="label">司龄</div>
            <div class="value">{{userInfo.age}}年</div>
          </div>
        </div>
      </div>
      <div class="chart-tags">
        <div class="chart">
          <img class="ai" :src="require('@/assets/image/ai.jpg')" alt="">
          <div class="left-tags">
            <el-checkbox v-model="checked" v-for="item in userInfo.tags" :key="item">
              {{item.tag}}
            </el-checkbox>
          </div>
        </div>
        <div class="list-wrap">
          <div class="list-title">标签列表 </div>

          <el-scrollbar height="330px">
            <div class="list-item" v-for="item in userInfo.tags" :key="item">
              <div class="label" :title="item.tag">
                {{ truncateString(item.tag,5) }}
              </div>
              <div class="time">{{ formatDate(item.updated_at)}}</div>
            </div>
          </el-scrollbar>
        </div>
      </div>
      <div class="cards">
        <div class="cards-item" v-for="item in userInfo.tags" :key="item">
          <Card
            :url="`http://192.168.1.62:30700/images/${userInfo.post_note}.png`"
            :post="item.tag"
            :approve="item.approve"
          ></Card>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { defineComponent, ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import Card from '@/components/Detail/Card'
import { useStore } from 'vuex'
import { formatDate } from '@/utils/date'
import { truncateString } from '@/utils'

export default defineComponent({
  name: 'detail-page',
  components: { Card },
  setup() {
    const route = useRoute()
    const visible = ref(false)
    const store = useStore()
    const id = route.params?.id
    onMounted(() => {
      store.dispatch('detail/fetchUserInfo', id).then(res => {
        // init()
      })
    })
    const userInfo = computed(() => store.state.detail.userInfo)

    return {
      visible,
      formatDate,
      userInfo,
      truncateString,
      checked: true
    }
  }
})
</script>
<style lang="scss" scoped>
.detail {
  .detail-banner{
    font-size: 0;
    .banner{
      width: 100%;
    }
  }
  .detail-content{
    position: relative;
    padding-top: 110px;
    .logo{
      width: 140px;
      height: 140px;
      background: #000000;
      border: 4px solid #acafff;
      border-radius: 10px;
      font-size: 50px;
      font-family: PingFang SC, PingFang SC-Medium;
      font-weight: 500;
      text-align: center;
      color: #868bff;
      line-height: 140px;
      position: absolute;
      top: -70px;
      left: 20px;
    }
    .detail-info{
      margin-bottom: 30px;
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
        width: 360px;
       .list-title{
        font-size: 25px;
        font-family: WDCH, WDCH-Regular;
        font-weight: 400;
        color: #000000;
        line-height: 30px;
        margin-bottom: 30px;
       }
        :deep(.el-scrollbar){
          .list-item{
            display: flex;
            align-items: center;
            justify-content: space-between;
            height: 50px;
            background: #ffffff;
            border: 0.5px solid rgba(151,151,151,0.25);
            border-radius: 8px;
            box-shadow: 0px 1px 20px 0px rgba(0,0,0,0.05);
            margin-bottom: 5px;
            padding: 0 30px;
          }
        }

      }
    }
    .cards{
      display: flex;
      justify-content:flex-start;
      align-items: center;
      flex-wrap: wrap;
      gap: 15px;
      margin-bottom: 50px;
      .cards-item{
        flex: 0 0 calc((100% - 60px)/5);
      }
    }
  }
}
</style>
