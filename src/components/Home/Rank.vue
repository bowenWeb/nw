<template>
  <div>
    <div class="home-rank" v-if="rankList.length">
      <div class="rank-left">
        <div class="rank-title">
            <div class="rank">Rank</div>
            <div class="name">大神</div>
            <div class="tags">数量</div>
        </div>
        <div class="rank-list">
            <div
              class="rank-item"
              v-for="(item,index) in rankList.slice(0,10)"
              :key="item.rank"
              @click="goToPage(item.roster_name)"
            >
                <div class="rank">{{ index +1 }}</div>
                <div class="name">
                    <div class="avatar">{{item.roster_name.slice(0,2)}}</div>
                    <div class="text">{{item.roster_name}}</div>
                    <img v-if="index===1" class="rank-no" :src="require('@/assets/image/home/icon-rank-2.png')" alt="">
                    <img v-if="index===2" class="rank-no" :src="require('@/assets/image/home/icon-rank-3.png')" alt="">
                    <img v-if="index===0" class="rank-no" :src="require('@/assets/image/home/icon-rank-1.png')" alt="">
                </div>
                <div class="tags"> TagX * {{item.tag_count}}</div>
            </div>
        </div>
      </div>
      <div class="rank-right" v-if="rankList.length>10">
        <div class="rank-title">
            <div class="rank">Rank</div>
            <div class="name">大神</div>
            <div class="tags">数量</div>
        </div>
        <div class="rank-list">
            <div
              class="rank-item"
              v-for="(item,index) in rankList.slice(10,20)"
              :key="item.rank"
              @click="goToPage(item.roster_name)"
            >
                <div class="rank">{{ index + 11 }}</div>
                <div class="name">
                    <div class="avatar">{{item.roster_name.slice(0,2)}}</div>
                    <div class="text" >{{item.roster_name}}</div>
                </div>
                <div class="tags"> TagX * {{item.tag_count}}</div>
            </div>
        </div>
      </div>
    </div>
    <div class="empty" v-else>
      暂无数据,快去<span class="submit">TagX</span>吧
    </div>
  </div>
</template>

<script>
import { defineComponent, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
export default defineComponent({
  name: 'home-rank-component',
  setup() {
    const store = useStore()
    // const { t } = useI18n()
    const rankList = computed(() => store.state.home.rankList)
    const router = useRouter()
    const goToPage = (name) => {
      if (name) {
        router.push({
          path: `/detail/${name}`
        })
      }
    }
    return {
      // t,
      goToPage,
      rankList
    }
  }
})
</script>

  <style lang="scss" scoped>
  .home-rank {
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: 100px;
    margin-bottom: 90px;
    .rank-left,.rank-right{
        .rank-title{
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom: 1px solid #E4E8EB;
            padding: 15px 0;
            font-size: 14px;
            font-family: PingFang SC, PingFang SC-Semibold;
            font-weight: 600;
            text-align: justify;
            color: #656e76;
            line-height: 20px;
            margin-bottom: 10px;
            .rank{
                flex-shrink: 0;
                flex-basis: 50px;
            }
            .name{
                flex:1;
            }
            .tags{
                flex-shrink: 0;
            }
        }

        .rank-list{
            .rank-item{
                display: flex;
                align-items: center;
                justify-content: space-between;
                font-size: 14px;
                font-family: PingFang SC, PingFang SC-Semibold;
                font-weight: 600;
                color: #171717;
                line-height: 20px;
                padding: 10px 0;
                cursor: pointer;
                transition: all 0.5s;
                &:hover{
                  background: #f4f5fe;
                  padding: 10px;
                  border-radius: 2px;
                }
                .rank{
                    flex-shrink: 0;
                    flex-basis: 50px;
                }
                .name{
                    flex:1;
                    display: flex;
                    align-items: center;
                    .avatar{
                        width: 48px;
                        height: 48px;
                        background: #000000;
                        border-radius: 6px;
                        font-size: 14px;
                        font-family: PingFang SC, PingFang SC-Semibold;
                        font-weight: 600;
                        text-align: justify;
                        color: #7863fb;
                        line-height: 20px;
                        text-align: center;
                        line-height: 48px;
                        margin-right: 10px;
                    }
                    .text{
                      cursor: pointer;
                      margin-right: 10px;
                    }

                    .rank-no{
                      width: 14px;
                      height: 16px;
                    }
                }
                .tags{
                    flex-shrink: 0;
                }
            }
        }
    }
  }
  .empty{
    padding: 30px;
    text-align: center;
    font-size: 15px;
    color: #171717;
    margin-bottom: 30px;
    .submit{
      text-decoration: underline;
      color: #7863fb;
      cursor: pointer;
      margin: 0 2px;
    }
  }
  </style>
