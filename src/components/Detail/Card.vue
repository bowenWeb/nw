<template>
  <div class="detail-card">
    <div class="image-wrap">
      <img class="nft" :src="obj.url" alt="">
    </div>
    <div class="mask"></div>
    <div class="card-info">
      <div class="tag">
        <span>{{ obj.post }}</span>
        <span class="add" @click="open">+1</span>
      </div>
      <div class="tags">Repetitions*{{ obj.approve }}</div>
    </div>
    <el-dialog
      v-model="dialogVisible"
      title="TagX"
      width="520"
      :before-close="close"
      :center="true"
      :modal-class="'detail-dialog'"
      :show-close="false"
    >
      <div class="detail-dialog-content">
        <div class="row">
          <div class="label">From：</div>
          <div class="value">{{ from }}</div>
        </div>
        <div class="row">
          <div class="label">To：</div>
          <div class="value">{{ to }}</div>
        </div>
        <div class="row">
          <div class="label">Tag：</div>
          <div class="value">{{ obj.post }}</div>
        </div>
        <div class="row">
          <div class="label">Balance：</div>
          <div class="value">{{ balance }} nw</div>
        </div>
        <div class="row">
          <div class="label">Gas：</div>
          <div class="value">{{ amount }} nw</div>
        </div>
      </div>
      <template #footer>
        <div class="btn-group">
          <div class="cancel-btn" @click="close">取消</div>
          <div class="confirm-btn">
            <el-button type="primary" :loading="loading" @click="add">确认</el-button>
          </div>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { defineComponent, reactive, ref } from 'vue'
import { useStore } from 'vuex'
import _ from 'lodash'
import { formatAmount } from '@/utils'
import { ElMessage } from 'element-plus'
import { useRoute } from 'vue-router'
export default defineComponent({
  name: 'detail-card-component',
  props: ['post', 'url', 'approve', 'from', 'to', 'balance'],
  setup(props) {
    const obj = reactive(props)
    const store = useStore()
    const dialogVisible = ref(false)
    const loading = ref(false)
    const amount = ref('0')
    const route = useRoute()
    const id = route.params?.id

    const add = () => {
      if (loading.value) return
      const params = {
        from_name: obj.from,
        to_name: obj.to,
        tag: obj.post,
        note: ''
      }
      store.dispatch('submit/fetchTagAppraisal', params).then(res => {
        loading.value = false
        close()
        ElMessage({
          showClose: true,
          message: '成功！',
          type: 'success'
        })
        store.dispatch('detail/fetchUserInfo', id)
      }).catch(error => {
        console.log(error, 'error submit!')
        loading.value = false
        close()
      })
    }
    const open = () => {
      dialogVisible.value = true
      getAmount()
    }
    const close = () => {
      dialogVisible.value = false
    }

    const getAmount = () => {
      store.dispatch('submit/fetchTagsAmount', {
        from_name: obj.from,
        to_name: obj.to,
        tag: obj.post
      }).then(res => {
        const value = _.get(res, 'data.amount')
        console.log(amount, 'amount')
        const str = formatAmount(value)
        amount.value = str
      })
    }

    return {
      obj,
      dialogVisible,
      add,
      open,
      close,
      loading,
      amount
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
      background: rgba(255,255,255,0.3);
      border-radius: 8px;
      backdrop-filter: blur(10px);
      z-index: 8;
    }

    .card-info{
      position: absolute;
      left: 20px;
      bottom:20px;
      width: calc(100% - 40px);
      z-index: 9;
      .tag{
        font-size: 14px;
        font-family: WDCH, WDCH-Regular;
        font-weight: 600;
        text-align: left;
        color: #000000;
        line-height: 19px;
        margin-bottom: 5px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .add{
          font-size: 18px;
          font-weight: 400;
          cursor: pointer;
          -webkit-animation-duration: 1s;
          animation-duration: 1s;
          -webkit-animation-duration: 1s;
          animation-duration: 1s;
          -webkit-animation-fill-mode: both;
          animation-fill-mode: both;
          animation-name: fadeInUp;
          -webkit-animation-iteration-count: infinite;
          animation-iteration-count: infinite;
          &:hover{
            animation-name: none;
          }
          @keyframes fadeInUp {
            from {
              opacity: 0;
              -webkit-transform: translate3d(0, 100%, 0);
              transform: translate3d(0, 100%, 0);
            }

            to {
              opacity: 1;
              -webkit-transform: translate3d(0, 0, 0);
              transform: translate3d(0, 0, 0);
            }
          }
        }
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

  :deep(.detail-dialog){
    .el-dialog__header{
      border-bottom:1px solid #e4e8eb;
      margin-right: 0;
    }
    .el-dialog__footer{
      border-top:1px solid #e4e8eb;
      .btn-group{
        display: flex;
        align-items: center;
        justify-content: center;
        column-gap: 10px;
        .confirm-btn{
          .el-button{
            background: #000000;
            border-radius: 12px;
            font-size: 14px;
            color: #fff;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            margin: 0 auto;
            border: none;
          }
        }
      }
    }
    .detail-dialog-content{
      padding: 0 100px 0 150px;
      .row{
        display: flex;
        align-items: center;
        margin-bottom: 10px;
        &:last-child{
          margin-bottom: 0;
        }
        .label{
          font-size: 14px;
          font-family: PingFang SC, PingFang SC-Semibold;
          font-weight: 600;
          text-align: center;
          color: #656e76;
          line-height: 20px;
        }
        .value{
          font-size: 14px;
          font-family: PingFang SC, PingFang SC-Semibold;
          font-weight: 600;
          text-align: center;
          color: #656e76;
          line-height: 20px;
        }
      }

    }

  }
  </style>
