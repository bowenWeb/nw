<template>
  <div class="home-card" @click="goToPage(obj.name)">
    <div class="image-wrap">
      <el-image class="nft" :src="obj.url" alt="" lazy />
    </div>
    <div class="card-info">
      <div class="name-tags">
        <div class="name" :title="obj.name">{{truncateString(obj.name)}}</div>
        <div class="tags">
          <span class="tag">TagX*{{ obj.tags }}</span>
        </div>
      </div>
      <div class="token">
        {{ formatAmount(obj.balance) }} nw
      </div>
    </div>

  </div>
</template>

<script>
import { defineComponent, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { formatAmount, truncateString } from '@/utils'
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
      truncateString,
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
    border: 0.5px solid rgba(151,151,151,0.25);
    box-shadow: 0px 1px 11px 0px rgba(0,0,0,0.10);
    position: relative;
    .image-wrap{
      width: 100%;
      border-radius: 12px;
      :deep(.nft){
        width: 100%;
        min-height: 90px;
      }
    }

    .card-info{
      width: 100%;
      border-radius: 10px;
      border-bottom: 1px solid #E6E8EC;
      position: absolute;
      bottom: 0;
      left: 0;
      padding: 15px 0;
      background: #fff;
      box-sizing: border-box;
      .name-tags{
        padding:0 15px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid #e6e8ec;

        .name{
          font-size: 14px;
          color: #2B2B2B;
          font-weight: bold;
          margin-bottom: 12px;
        }
        .tags{
          display: flex;
          align-items: center;
          font-size: 12px;
          font-family: PingFang SC, PingFang SC-Medium;
          font-weight: 500;
          text-align: left;
          margin-bottom: 12px;
          column-gap: 10px;
          .tag{
            padding: 3px 8px;
            background: #7863fb;
            line-height: 12px;
            color: #fff;
            border-radius: 4px;
          }
        }
      }
      .token{
        padding: 15px 15px 0;
        font-size: 12px;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
    }

  }
  </style>
