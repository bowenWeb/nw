<template>
  <div class="home">
    <div class="content-width">
      <div class="banner-swiper swiper">
        <div class="swiper-wrapper">
          <div class="swiper-slide" v-for="item in [1,2,3,4,5,6,7,8,9,10]" :key="item">
            <div class="banner-item">
              <div class="banner-left">
                <div class="banner-title">‘超’好玩的互动平台</div>
                <div class="banner-des">发起提议，匿名评价，友好互动</div>
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
            <div :class="activeTab === item.value ? 'active tabs-item' : 'tabs-item'" v-for="item in tabs"
              :key="item.value" @click="tabClick(item)">
              {{ item.label }}
            </div>
          </div>
        </div>
      </div>
      <Rank></Rank>
    </div>
    <div class="position" v-for="(n,index) in jobs" :key="index">
      <div class="list-header content-width">
      <div class="list-header-left">
        <div class="text">{{n.post}}</div>
        <div class="img-wrap">
          <img class="line" :src="require('@/assets/image/home/icon-line.png')" alt="">
        </div>
      </div>
      <div class="list-header-right swiper-action">
        <div :class="`swiper-${n.note}-prev swiper-prev`"><el-icon><Back /></el-icon></div>
        <div :class="`swiper-${n.note}-next swiper-next`"><el-icon><Right /></el-icon></div>
      </div>
    </div>
    <div class="cards" :style="{paddingLeft: paddingLeft}">
      <div class="swiper" :id="`swiper-${n.note}`">
        <div class="swiper-wrapper">
          <div class="swiper-slide" v-for="(m,idx) in n.child" :key="idx">

            <Card
              :id="m.id"
              :name="m.roster_name"
              :url="`http://192.168.1.62:30700/images/${n.note}.png`"
              :balance="m.balance"
              :tags="m.tags?.length"
            ></Card>
          </div>
        </div>
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
    const keywords = ref('')
    const activeTab = ref(7)
    const paddingLeft = ref(0)
    const jobs = computed(() => store.state.home.jobs)
    const tabs = [
      {
        label: '7天',
        value: 7
      }, {
        label: '15天',
        value: 15
      }, {
        label: '30天',
        value: 30
      }
    ]
    onMounted(() => {
      const _width = document.getElementById('home-content').clientWidth
      paddingLeft.value = `calc((100% - ${_width}px)/2)`

      new Swiper('.banner-swiper', {
        slidesPerView: 1,
        loop: true
      })

      store.dispatch('home/fetchPopularList', activeTab.value)
      store.dispatch('home/fetchInfo').then(res => {
        const list = res ?? []
        list.forEach(n => {
          new Swiper(`#swiper-${n.note}`, {
            slidesPerView: 6,
            spaceBetween: 10,
            navigation: {
              nextEl: `.swiper-${n.note}-next`,
              prevEl: `.swiper-${n.note}-prev`
            }
          })
        })
      })
    })
    const filterStatus = (value, row) => {
      return row.ServerStatus.databaseStatus === value
    }
    const infoSearch = () => {
      console.log(keywords, 'keywords')
    }

    const tabClick = (item) => {
      activeTab.value = item.value
      store.dispatch('home/fetchPopularList', item.value)
    }

    const tabsClass = () => {
      const obj = {
        7: 'tabs t0',
        15: 'tabs t1',
        30: 'tabs t2'
      }
      return obj[activeTab.value]
    }

    return {
      keywords,
      infoSearch,
      filterStatus,
      tabsClass,
      activeTab,
      tabClick,
      tabs,
      jobs,
      paddingLeft
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
        border-radius: 10px;
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

  .list-header {
    display: flex;
    align-items: center;
    justify-content: space-between;

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
    .swiper-action{
      display: flex;
      align-items: center;
      margin-bottom: 20px;
      .swiper-prev,.swiper-next{
        cursor: pointer;
        width:40px;
        height:40px;
        display: flex;
        justify-content: center;
        align-items: center;
        &.swiper-button-disabled{
          cursor:not-allowed;
        }
      }
      .swiper-next{
        border: 1px solid #e6e8ec;
        border-radius: 50%;
      }
    }

    .list-header-right {
      .tabs {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 155px;
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
            left:54px;
            top: 50%;
            transform: translateY(-50%);
          }
        }
        &.t2{
          &::after{
            position: absolute;
            left: 105px;
            top: 50%;
            transform: translateY(-50%);
          }
        }
        &::after{
          content: '';
          width: 49px;
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

  .position{
    width: 100%;
    overflow: hidden;
    .cards {
      display: flex;
      column-gap: 20px;
      :deep{
        .swiper{
            width: 100%;
            margin-bottom: 60px;
            padding-bottom: 20px;
            overflow: hidden;
        }
      }
    }
  }

}
</style>
