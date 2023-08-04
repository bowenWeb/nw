<template>
  <div class="personal">
    <div class="personal-banner">
      <img class="banner" :src="require('@/assets/image/dog-bg.png')" alt="">
    </div>
    <div class="personal-content content-width">
      <div class="logo">{{userInfo.roster_name?.slice(0,2)}}</div>
      <div class="personal-info">
        <div class="name">{{userInfo.roster_name}}</div>
        <div class="tags">收到的标签数量: {{ userInfo.tags?.length??0 }}</div>
        <div class="row">
          <div class="year">
            <div class="label">Token</div>
            <div class="value">{{ formatAmount(userInfo.balance) }}</div>
          </div>
          <div class="position">
            <div class="label">职位</div>
            <div class="value">{{userInfo.post}}</div>
          </div>

        </div>
      </div>
      <div class="cards-title">标签</div>
      <div class="cards">
        <div class="cards-item" v-for="(item,index) in userInfo.tags" :key="item">
          <Card
            :url="`http://192.168.1.62:30700/images/${userInfo.post_note}.png`"
            :tag="item.note"
            :approve="item.approve"
            :key="'personal-card'+index"
          >
          </Card>
        </div>
      </div>
      <div class="submit-wrap">
        <div class="submit-title">评价列表</div>
        <el-table :data="userInfo.tags" style="width: 100%">
          <el-table-column prop="note" label="标签" width="180" />
          <el-table-column prop="approve" label="标签共识数" />
          <el-table-column prop="created_at" label="评价时间">
            <template #default="scope">
              {{formatDate(scope.row.created_at)}}
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

  </div>
</template>
<script>
import { defineComponent, computed } from 'vue'
import Card from '@/components/Personal/Card'
import { useStore } from 'vuex'
import { formatDate } from '@/utils/date'
import { formatAmount } from '@/utils'
export default defineComponent({
  name: 'personal-page',
  components: { Card },
  setup() {
    const store = useStore()
    const userInfo = computed(() => store.state.global.userInfo)

    return {
      userInfo,
      formatAmount,
      formatDate
    }
  }
})
</script>
<style lang="scss" scoped>
.personal {
  .personal-banner{
    .banner{
      width: 100%;
    }
  }
  .personal-content{
    position: relative;
    padding-top: 100px;
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
    .personal-info{
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
        .year,.position{
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

    .cards{
      display: flex;
      justify-content:flex-start;
      align-items: center;
      flex-wrap: wrap;
      gap: 15px;
      margin-bottom: 100px;
      .cards-item{
        flex: 0 0 calc((100% - 60px)/5);
      }
    }

    .cards-title,.submit-title{
        font-size: 25px;
        font-family: WDCH, WDCH-Regular;
        font-weight: 600;
        color: #000000;
        line-height: 30px;
        margin-bottom: 30px;
      }

    .submit-wrap{
      margin-bottom: 50px;
    }
  }
}
</style>
