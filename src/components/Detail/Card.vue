<template>
    <div class="detail-card">
      <div class="image-wrap">
        <img class="nft" :src="obj.url" alt="">
      </div>
      <div class="mask"></div>
      <div class="card-info">
        <div class="name">{{ obj.post }}</div>
        <div class="tags">认同*{{ obj.approve }}</div>
      </div>
    </div>
  </template>

<script>
import { defineComponent, reactive } from 'vue'
export default defineComponent({
  name: 'detail-card-component',
  props: ['post', 'url', 'approve'],
  setup(props) {
    const obj = reactive(props)
    return {
      obj
    }
  }
})
</script>

  <style lang="scss" scoped>
  .detail-card {
    position: relative;
    border-radius: 10px;
    cursor: pointer;
    .image-wrap{
      width: 100%;
      border-radius: 12px;
      margin-bottom: 10px;
      .nft{
        width: 100%;
      }
    }

    .mask{
      position: absolute;
      left: 10px;
      bottom:10px;
      width: calc(100% - 20px);
      height: 66px;
      background: rgba(255,255,255,0.40);
      border-radius: 8px;
      filter: blur(0px);
      z-index: 8;
    }

    .card-info{
      position: absolute;
      left: 20px;
      bottom:20px;
      width: calc(100% - 40px);
      z-index: 9;
      .name{
        font-size: 14px;
        font-family: WDCH, WDCH-Regular;
        font-weight: 600;
        text-align: left;
        color: #000000;
        line-height: 19px;
        margin-bottom: 5px;
      }
      .tags{
        font-size: 14px;
        font-family: PingFang SC, PingFang SC-Regular;
        font-weight: 400;
        text-align: left;
        color: rgba(0,0,0,0.5);
        line-height: 20px;
      }
    }

  }
  </style>
