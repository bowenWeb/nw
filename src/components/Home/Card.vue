<template>
  <div class="home-card" @click="goToPage(obj.name)">
    <div class="image-wrap">
      <img class="nft" :src="obj.url" alt="">
    </div>
    <div class="card-info">
      <div class="name-tags">
        <div class="name">{{obj.name}}</div>
        <div class="tags">{{obj.tags}} 标签</div>
      </div>
    </div>
    <div class="token">
      <div>{{ formatAmount(obj.balance) }} nw</div>
    </div>
  </div>
</template>

<script>
import { defineComponent, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { formatAmount } from '@/utils'
export default defineComponent({
  name: 'card-component',
  props: ['name', 'url', 'balance', 'tags'],
  setup(props) {
    const router = useRouter()
    const goToPage = (name) => {
      if (name) {
        router.push({
          path: `/detail/${name}`
        })
      }
    }
    const obj = reactive(props)
    return {
      formatAmount,
      goToPage,
      obj
    }
  }
})
</script>

  <style lang="scss" scoped>
  .home-card {
    border-radius: 10px;
    cursor: pointer;
    box-shadow: 0px 1px 11px 0px rgba(0,0,0,0.10);
    .image-wrap{
      width: 100%;
      border-radius: 12px;
      margin-bottom: 10px;
      .nft{
        width: 100%;
      }
    }

    .card-info{
      border-bottom: 1px solid #E6E8EC;
      .name-tags{
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 15px;
        margin-bottom: 10px;
        .name{
          font-size: 14px;
          color: #2B2B2B;
          font-weight: bold;
        }
        .tags{
          padding: 3px 8px;
          font-size: 12px;
          font-family: PingFang SC, PingFang SC-Medium;
          font-weight: 500;
          text-align: left;
          color: #676ff7;
          line-height: 12px;
          border: 1px solid #676ff7;
          border-radius: 4px;
        }
      }
    }

    .token{
      padding: 15px;
      font-size: 12px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }
  </style>
