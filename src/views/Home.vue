<template>
  <div class="home">
    <div class="content-width">
      <div class="banner-swiper swiper">
        <div class="swiper-wrapper">
          <div class="swiper-slide" v-for="item in [1]" :key="item">
            <div class="banner-item">
              <div class="banner-left">
                <div class="banner-title">超Web3的数字身份标签平台</div>
                <div class="banner-des">一个数字身份、声誉标签、互动标记的社交平台</div>
              </div>
              <div class="banner-right">
                <img class="banner-bg" :src="require('@/assets/image/home/banner-1.png')" alt="">
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="list-header" id="home-content">
        <div class="list-header-left">
          <div class="text">最热</div>
          <div class="img-wrap">
            <img class="ad" :src="require('@/assets/image/home/icon-ad.png')" alt="">
          </div>
        </div>
        <div class="list-header-right">
          <div :class="tabsClass()">
            <div
              v-for="item in tabs"
              class="tabs-item"
              :class="activeTab === item.value ? 'active' : ''"
              :key="item.value" @click="tabClick(item)"
            >
              {{ item.label }}
            </div>
          </div>
        </div>
      </div>
      <Rank v-if="activeTab === 20"></Rank>
      <div v-else class="cards">
        <div class="card-item" v-for="(item,index) in allList" :key="index">
          <Card
            :id="item.id"
            :name="item.roster_name"
            :url="`http://192.168.1.62:30700/images/${item.post_note}.png`"
            :balance="item.balance"
            :tags="item.tag_count"
          ></Card>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { defineComponent, onMounted, ref, computed } from 'vue'
import Card from '@/components/Home/Card'
import Rank from '@/components/Home/Rank'
import { useStore } from 'vuex'
import Swiper from 'swiper'
import 'swiper/css/swiper.css'

export default defineComponent({
  name: 'pageHome',
  components: { Card, Rank },
  setup() {
    const store = useStore()
    const activeTab = ref(20)
    const tabs = [
      {
        label: 'Top20',
        value: 20
      },
      {
        label: 'All',
        value: 0
      }
    ]
    onMounted(() => {
      new Swiper('.banner-swiper', {
        slidesPerView: 1
      })
      store.dispatch('home/fetchRankList')
      store.dispatch('home/fetchAllList')
    })

    const tabClick = (item) => {
      activeTab.value = item.value
    }

    const tabsClass = () => {
      const obj = {
        20: 'tabs t0',
        0: 'tabs t1'
      }
      return obj[activeTab.value]
    }

    return {
      tabsClass,
      activeTab,
      tabClick,
      tabs,
      rankList: computed(() => store.state.home.rankList),
      allList: computed(() => store.state.home.allList)
    }
  }
})
</script>
<style lang="scss" scoped>
.home {
  padding-bottom: 30px;
  .banner-swiper{
    margin-bottom: 40px;
    overflow: hidden;
    :deep(.swiper-wrapper) {
      .banner-item{
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 40px 52px;
        background: linear-gradient(180deg,#fefffe 0%, #dfe1ff 48%, #fefffe 100%);
        border-radius: 12px;
        .banner-left{
          .banner-title{
            font-size: 50px;
            font-family: PingFang SC, PingFang SC-Semibold;
            font-weight: 600;
            color: #000000;
            line-height: 70px;
            margin-bottom: 5px;
          }
          .banner-des{
            font-size: 18px;
            font-family: PingFang SC, PingFang SC-Regular;
            font-weight: 400;
            color: #000000;
            line-height: 25px;
          }
        }
        .banner-right{
          .banner-bg{
            height: 316px;
          }
        }
      }
    }
  }

  .cards {
    display: grid;
    grid-template-columns: repeat(6,1fr);
    gap: 20px;
    .card-item{
      cursor: pointer;
      transition: all 0.3s;
      &:hover{
        transform: scale(1.1);
      }
    }
  }

  .list-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
    .list-header-left {
      display: flex;
      align-items: center;
      .text {
        font-size: 25px;
        font-family: WDCH, WDCH-Regular;
        font-weight: 600;
        color: #000000;
        line-height: 49px;
        margin-right: 10px;
      }

      .img-wrap {
        .line{
          width: 182px;
          height: 10px;
        }
        .ad{
          width: 31px;
          height: 31px;
        }

      }
    }
    .list-header-right {
      .tabs {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 142px;
        height: 34px;
        background: #f6f6f6;
        border-radius: 8px;
        position: relative;
        &.t0{
          &::after{
            position: absolute;
            left: 2px;
            top: 50%;
            transform: translateY(-50%);
          }
        }
        &.t1{
          &::after{
            position: absolute;
            left:70px;
            top: 50%;
            transform: translateY(-50%);
          }
        }
        &::after{
          content: '';
          width: 70px;
          height: 30px;
          background: #ffffff;
          border-radius: 7px;
          transition: all 0.3s;
          z-index: 2;
        }
        .tabs-item {
          flex: 1;
          flex-shrink: 0;
          text-align: center;
          font-size: 14px;
          font-family: PingFang SC, PingFang SC-Semibold;
          font-weight: 600;
          text-align: center;
          color: #656e76;
          line-height: 20px;
          cursor: pointer;
          position: relative;
          z-index: 9;
          &.active {
            color: #000000;
          }
        }
      }
    }
  }

}
</style>
