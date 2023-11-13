<template>
  <div class="proposal">
    <div class="banner">
      <div class="bg">
        <div class="title">“为价值提案，为提案定价”</div>
        <div class="des">为你看到的价值行为定价，通过提案，把Token赋予TA</div>
      </div>
      <img class="img" :src="require('@/assets/image/cloud-bg.png')" alt="">
    </div>

    <div class="proposal-table content-width">
      <div class="table-action">
        <div class="title">提案列表</div>
        <div class="confirm-btn" @click="openDrawer">添加</div>
      </div>
      <div class="tabs">
        <div
          :class="activeTab===item.value?'active tab':'tab'"
          v-for="(item,index) in tabs"
          :key="'tab'+index"
          @click="handleChange(item.value)"
        >
          {{item.label}}
        </div>
      </div>

      <div class="table">
        <el-table border :data="proposalList" style="width: 100%">
          <el-table-column prop="from_roster_name" label="From" width="100" />
          <el-table-column prop="to_roster_name" label="To" width="100" />
          <el-table-column prop="value" label="Token" >
            <template #default="scope">
              {{formatAmount(scope.row.value)}} nw
            </template>
          </el-table-column>

          <el-table-column prop="created_at" label="创建时间">
            <template #default="scope">
              {{formatDate(scope.row.created_at,'YYYY-MM-DD HH:mm')}}
            </template>
          </el-table-column>
          <el-table-column prop="end_at" label="结束时间">
            <template #default="scope">
              {{formatDate(scope.row.end_at,'YYYY-MM-DD HH:mm')}}
            </template>
          </el-table-column>

          <el-table-column label="投票进度">
            <template #default="scope">
              <el-progress
                :text-inside="true"
                :stroke-width="20"
                :percentage="getProgress(scope.row.votes,scope.row.total_holder)"
                :color="'#767ffc'"
              />
            </template>
          </el-table-column>

          <el-table-column label="是否通过" v-if="!activeTab">
            <template #default="scope">
              <div class="pass">
                <el-icon
                  v-if='getProgress(scope.row.votes,scope.row.total_holder) >= 20'
                  :color="'#767ffc'"
                >
                  <SuccessFilled />
                </el-icon>
                <el-icon v-else :color="'#f56c6c'"><CircleCloseFilled /></el-icon>
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="note" label="提案内容" width="240"/>
          <el-table-column label="操作" v-if="activeTab">
            <template #default="scope">
              <div class="table-row-action">
                <span v-if="scope.row.voted">已投票</span>
                <span class="action" v-else @click="voteProposal(scope.row.id)">投票</span>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="pagination">
        <el-pagination background layout="prev, pager, next" :current-page="params.page" :page-size="params.size" :total="total" />
      </div>
    </div>

    <el-drawer v-model="drawer"
      title="添加提案"
      :before-close="closeDrawer"
    >

      <template #default>
        <div class="form-wrap">
          <el-form
            ref="proposalFormRef"
            :model="formData"
            :rules="rules"
            class="submit-form"
            label-position="top"
          >
            <el-form-item label="From" prop="from">
              <el-input v-model="formData.from" autocomplete="off" disabled />
            </el-form-item>
            <el-form-item label="To" prop="to">
              <el-select v-model="formData.to" filterable placeholder="请选择花名">
                <el-option
                  v-for="item in rosterNames"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="Value" prop="value">
              <el-input v-model="formData.value" autocomplete="off" :formatter="inputLimit"/>
            </el-form-item>
            <el-form-item label="提案内容" prop="note" class="textarea-item">
              <el-input v-model="formData.note" autocomplete="off" type="textarea" rows="3"/>
            </el-form-item>
          </el-form>
        </div>
      </template>
      <template #footer>
        <div class="btn-group">
          <div class="cancel-btn" @click="closeDrawer">取消</div>
          <div class="confirm-btn" type="primary">
            <el-button type="primary" :loading="loading" @click="submitForm">确认</el-button>
          </div>
        </div>
      </template>
    </el-drawer>
  </div>
</template>
<script>
import { ref, reactive, defineComponent, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { formatDate } from '@/utils/date'
import { formatAmount, amountToNW } from '@/utils'
import { ElMessageBox, ElMessage } from 'element-plus'
import Decimal from 'decimal.js'
export default defineComponent({
  name: 'proposal-page',
  setup() {
    const store = useStore()
    const proposalFormRef = ref()
    const loading = ref(false)
    onMounted(() => {
      store.commit('proposal/SET_PARAMS', { active: true, page: 1, size: 20 })
      store.dispatch('proposal/fetchProposalList', store.state.proposal.params)
      store.dispatch('global/fetchRosterNames')
    })
    const formData = reactive({
      from: computed(() => store.state.global.userInfo.roster_name),
      to: '',
      value: '',
      note: ''
    })

    const tabs = [
      {
        label: 'Open',
        value: true
      },
      {
        label: 'Close',
        value: false
      }
    ]

    const oldValue = ref('')
    const rules = reactive({
      to: [
        { required: true, message: '请输入花名', trigger: 'blur' },
        { pattern: /^[\u4E00-\u9FA5A-Za-z]+$/, message: '请输入中文、英文字符！', trigger: 'blur' }
      ],
      value: { required: true, message: '请选择数值', trigger: 'blur' }
    })

    const inputLimit = (value) => {
      if (/^[0-9]*[.]?[0-9]*$/.test(value)) {
        oldValue.value = value
        return value
      } else {
        return oldValue
      }
    }
    const submitForm = (formEl) => {
      if (!proposalFormRef.value) return
      if (loading.value) return
      proposalFormRef.value.validate((valid) => {
        if (valid) {
          loading.value = true
          const params = {
            note: formData.note,
            to_user: formData.to,
            value: amountToNW(formData.value)
          }
          store.dispatch('proposal/fetchProposalAdd', params).then(res => {
            ElMessage({
              showClose: true,
              message: '成功！',
              type: 'success'
            })
            drawer.value = false
            loading.value = false
            store.commit('proposal/SET_PARAMS', { active: true, page: 1, size: 20 })
            store.dispatch('proposal/fetchProposalList', store.state.proposal.params)
            store.dispatch('global/fetchProposalList')
          }).catch(error => {
            console.log(error, 'error')
            loading.value = false
          })
        } else {
          console.log('error submit!')
          return false
        }
      })
    }

    const drawer = ref(false)
    const tagsList = computed(() => store.state.global.tagsList)

    const resetForm = () => {
      formData.to = 0
      formData.value = ''
      formData.note = ''
      if (!proposalFormRef.value) return
      proposalFormRef.value.resetFields()
    }

    const openDrawer = () => {
      drawer.value = true
    }
    const closeDrawer = () => {
      drawer.value = false
      resetForm()
    }
    const activeTab = ref(true)
    const handleChange = (tab) => {
      activeTab.value = tab
      store.commit('proposal/SET_PARAMS', { active: tab, page: 1, size: 20 })
      store.dispatch('proposal/fetchProposalList', store.state.proposal.params)
    }
    const voteProposal = (id) => {
      ElMessageBox.confirm('确认要投票此提案吗?')
        .then(() => {
          store.dispatch('proposal/fetchProposalVote', id).then(res => {
            store.dispatch('global/fetchProposalList')
            store.commit('proposal/SET_PARAMS', { active: true, page: 1, size: 20 })
            store.dispatch('proposal/fetchProposalList', store.state.proposal.params)
            ElMessage({
              showClose: true,
              message: '成功！',
              type: 'success'
            })
          })
        })
        .catch(() => { })
    }

    const getProgress = (votes = '0', total = '0') => {
      const progress = new Decimal(votes).div(total).times('100').toFixed(0, Decimal.ROUND_DOWN)
      const res = new Decimal(progress).toNumber()
      console.log(typeof res, 'res ttt')
      return res
    }

    return {
      activeTab,
      handleChange,
      proposalFormRef,
      formData,
      rules,
      tagsList,
      drawer,
      proposalList: computed(() => store.state.proposal.proposalList),
      total: computed(() => store.state.proposal.total),
      params: computed(() => store.state.proposal.params),
      rosterNames: computed(() => store.state.global.rosterNames),
      openDrawer,
      closeDrawer,
      submitForm,
      formatDate,
      formatAmount,
      voteProposal,
      inputLimit,
      loading,
      getProgress,
      tabs
    }
  }
})
</script>
<style lang="scss" scoped>
.proposal {
  width: 100%;
  flex: 1;
  .banner{
    margin-bottom: 60px;
    position: relative;
    height: 370px;
    .img{
      width: 70%;
      max-width: 1000px;
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
    }
    .bg{
      width: 100%;
      height: 370px;
      background: linear-gradient(180deg,#fefffe, #dfe1ff 55%, #c9bdff 97%);
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;
      .title{
        font-size: 50px;
        font-family: PingFang SC, PingFang SC-Semibold;
        font-weight: 600;
        text-align: left;
        color: #000;
        line-height: 70px;
        margin-bottom: 10px;
        padding-top: 50px;
      }
      .des{
        font-size: 16px;
        font-family: PingFang SC, PingFang SC-Semibold;
        font-weight: 600;
        text-align: left;
        color: #000;
        line-height: 22px;
      }
    }
  }
  .tabs{
    display: flex;
    align-items: center;
    .tab{
      border:1px solid #e6e8ec;
      font-size: 14px;
      font-family: PingFang SC, PingFang SC-Semibold;
      font-weight: 600;
      color: #656e76;
      line-height: 20px;
      padding: 7px 20px;
      margin-bottom: 20px;
      cursor: pointer;
      &:last-child{
        border-left: none;
      }
      &.active{
        background: #000000;
        color: #ffffff;
      }
    }
  }
  .proposal-table{
    margin-bottom: 50px;
    .table-action{
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      .title{
        font-size: 16px;
        font-family: WDCH, WDCH-Regular;
        font-weight: 400;
        color: #000000;
        line-height: 49px;
      }
    }
    .table{
      margin-bottom: 20px;
      :deep(.el-table){
        .el-table__cell{
          .pass{
            .el-icon{
              font-size: 22px;
            }
          }
        }
      }
    }
    .pagination{
      display: flex;
      justify-content: flex-end;
    }
  }

  :deep(.el-drawer){
    .el-form-item{
      margin-bottom: 24px;
      .el-select,.el-date-editor{
        width: 100%;
      }
    }
    .btn-group{
      display: flex;
      align-items: center;
      justify-content: flex-end;
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
}
</style>
