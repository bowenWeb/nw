<template>
  <div class="personal">
    <div class="personal-banner">
      <img class="img" :src="require('@/assets/image/cloud-bg-4.png')" alt="">
    </div>
    <div class="personal-content content-width">
      <div class="logo">{{userInfo.roster_name?.slice(0,2)}}</div>
      <div class="personal-info">
        <div class="name">{{userInfo.roster_name}}</div>
        <div class="tags">收到的TagX数量: {{ userInfo.tags?.length??0 }}</div>
        <div class="row">
          <div class="year">
            <div class="label">Token</div>
            <div class="value">{{ userInfo.balance }} nw</div>
          </div>
          <div class="position">
            <div class="label">司龄</div>
            <div class="value">{{userInfo.age}}</div>
          </div>

        </div>
      </div>
      <div class="cards-title">TagX</div>
      <div class="cards" v-if="userInfo.tags?.length">
        <div class="cards-item" v-for="(item,index) in userInfo.tags" :key="item">
          <Card
            :url="`http://192.168.1.62:30700/images/${userInfo.post_note}.png`"
            :tag="item.tag"
            :approve="item.approve"
            :key="'personal-card'+index"
          >
          </Card>
        </div>
      </div>
      <div class="cards" v-else>
        <div class="no-data">暂无数据</div>
      </div>
      <div class="appraisals-table">
        <div class="appraisals-title">已标记的TagX列表</div>
        <div class="table">
          <el-table border  :data="appraisals" style="width: 100%">
            <el-table-column prop="roster_name" label="To"/>
            <el-table-column prop="tag_info" label="TagX" />
            <el-table-column prop="approve" label="TagX共识数" />
            <el-table-column prop="created_at" label="时间" width="180" >
              <template #default="scope">
                {{formatDate(scope.row.created_at)}}
              </template>
            </el-table-column>
            <el-table-column prop="tag_note" label="备注" />
          </el-table>
        </div>
        <div class="pagination">
          <el-pagination background layout="prev, pager, next" :current-page="params.page" :page-size="params.size" :total="total" @current-change="handleCurrentChange"/>
        </div>
      </div>

      <div class="appraisals-table">
        <div class="appraisals-title">我的Token记录</div>
        <div class="table">
          <el-table border  :data="tokenList" style="width: 100%">
            <el-table-column prop="from_name" label="From"/>
            <el-table-column prop="to_name" label="To" />
            <el-table-column prop="value" label="Value">
              <template #default="scope">
                {{formatAmount(scope.row.value)+` nw`}}
              </template>
            </el-table-column>
            <el-table-column prop="updated_at" label="时间" width="180" >
              <template #default="scope">
                {{formatDate(scope.row.updated_at,"YYYY-MM-DD HH:mm")}}
              </template>
            </el-table-column>
            <el-table-column prop="op" label="操作">
              <template #default="scope">
                {{scope.row.op}}
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="pagination">
          <el-pagination background layout="prev, pager, next" :current-page="tokenParams.page" :page-size="tokenParams.size" :total="tokenTotal" @current-change="handleTokenChange"/>
        </div>
      </div>
    </div>

  </div>
</template>
<script>
import { defineComponent, computed, onMounted } from 'vue'
import Card from '@/components/Personal/Card'
import { useStore } from 'vuex'
import { formatDate } from '@/utils/date'
import { formatAmount } from '@/utils'

export default defineComponent({
  name: 'personal-page',
  components: { Card },
  setup() {
    const store = useStore()
    onMounted(() => {
      store.commit('personal/SET_PARAMS', { page: 1, size: 20 })
      store.dispatch('personal/fetchAppraisals', store.state.personal.params)

      store.commit('personal/SET_TOKEN_PARAMS', { page: 1, size: 20 })
      store.dispatch('personal/fetchTokenList', store.state.personal.tokenParams)
    })

    const handleCurrentChange = (page) => {
      store.commit('personal/SET_PARAMS', {
        page,
        size: 20
      })
      store.dispatch('personal/fetchAppraisals', store.state.personal.params)
    }

    const handleTokenChange = (page) => {
      store.commit('personal/SET_TOKEN_PARAMS', { page, size: 20 })
      store.dispatch('personal/fetchTokenList', store.state.personal.tokenParams)
    }

    return {
      userInfo: computed(() => store.state.global.userInfo),
      appraisals: computed(() => store.state.personal.appraisals),
      total: computed(() => store.state.personal.total),
      params: computed(() => store.state.personal.params),
      tokenList: computed(() => store.state.personal.tokenList),
      tokenTotal: computed(() => store.state.personal.tokenTotal),
      tokenParams: computed(() => store.state.personal.tokenParams),
      handleCurrentChange,
      handleTokenChange,
      formatDate,
      formatAmount
    }
  }
})
</script>
<style lang="scss" scoped>
.personal {
  .personal-banner{

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
  .personal-content{
    position: relative;
    padding-top: 100px;
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
      display: grid;
      grid-template-columns: repeat(6,1fr);
      gap: 20px;
      margin-bottom: 100px;
      .cards-item{
        cursor: pointer;
        transition: all 0.3s;
        &:hover{
          transform: scale(1.1);
        }
      }
    }

    .cards-title,.appraisals-title{
        font-size: 25px;
        font-family: WDCH, WDCH-Regular;
        font-weight: 600;
        color: #000000;
        line-height: 30px;
        margin-bottom: 30px;
      }

    .appraisals-table{
      margin-bottom: 50px;
      .table{
        margin-bottom: 20px;
      }
      .pagination{
        display: flex;
        justify-content: flex-end;
      }
    }
  }
}
</style>
