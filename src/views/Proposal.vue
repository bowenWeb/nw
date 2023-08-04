<template>
  <div class="proposal">
    <div class="proposal-banner">
      <img class="banner" :src="require('@/assets/image/personal-bg.png')" alt="">
    </div>

    <div class="proposal-table content-width">
      <div class="table-action">
        <div class="title">提案列表</div>
        <div class="confirm-btn" @click="openDrawer">添加</div>
      </div>
      <el-tabs
        v-model="activeTab"
        type="card"
        class="proposal-tabs"
        @tab-change="handleChange"
      >
        <el-tab-pane label="活跃" name="first">
          <div class="table">
            <el-table border :data="proposalList" style="width: 100%">
              <el-table-column prop="from_roster_name" label="From" width="180" />
              <el-table-column prop="to_roster_name" label="To" width="180" />
              <el-table-column prop="value" label="Token" >
                <template #default="scope">
                  {{formatAmount(scope.row.value)}} nw
                </template>
              </el-table-column>
              <el-table-column prop="active" label="状态" >
                <template #default="scope">
                  {{ scope.row.active ? '活跃':'失效'}}
                </template>
              </el-table-column>

              <el-table-column prop="created_at" label="创建时间">
                <template #default="scope">
                  {{formatDate(scope.row.created_at,'YYYY-MM-DD HH:mm:ss')}}
                </template>
              </el-table-column>
              <el-table-column prop="end_at" label="结束时间">
                <template #default="scope">
                  {{formatDate(scope.row.end_at,'YYYY-MM-DD HH:mm:ss')}}
                </template>
              </el-table-column>
              <el-table-column prop="note" label="备注" />
              <el-table-column label="操作">
                <template #default="scope">
                  <div class="table-row-action">
                    <span v-if="scope.row.voted">已同意</span>
                    <span v-else @click="voteProposal(scope.row.id)">同意</span>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
        <el-tab-pane label="失效" name="second">
          <div class="table">
            <el-table border :data="proposalList" style="width: 100%">
              <el-table-column prop="from_roster_name" label="From" width="180" />
              <el-table-column prop="to_roster_name" label="To" width="180" />
              <el-table-column prop="value" label="Token">
                <template #default="scope">
                  {{formatAmount(scope.row.value)}} nw
                </template>
              </el-table-column>
              <el-table-column prop="active" label="状态">
                <template #default="scope">
                  {{ scope.row.active ? '活跃':'失效'}}
                </template>
              </el-table-column>
              <el-table-column prop="created_at" label="创建时间">
                <template #default="scope">
                  {{formatDate(scope.row.created_at,'YYYY-MM-DD HH:mm:ss')}}
                </template>
              </el-table-column>
              <el-table-column prop="end_at" label="结束时间">
                <template #default="scope">
                  {{formatDate(scope.row.end_at,'YYYY-MM-DD HH:mm:ss')}}
                </template>
              </el-table-column>
              <el-table-column prop="note" label="备注" />
            </el-table>
          </div>
        </el-tab-pane>
      </el-tabs>

      <div class="pagination">
        <el-pagination background layout="prev, pager, next" :total="total" />
      </div>
    </div>

    <el-drawer v-model="drawer"
      title="添加用户"
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
              <el-input v-model="formData.to" autocomplete="off" />
            </el-form-item>
            <el-form-item label="Value" prop="value">
              <el-input v-model="formData.value" autocomplete="off" />
            </el-form-item>
            <el-form-item label="备注" prop="note" class="textarea-item">
              <el-input v-model="formData.note" autocomplete="off" type="textarea" rows="3"/>
            </el-form-item>
          </el-form>
        </div>
      </template>
      <template #footer>
        <div class="btn-group">
          <div class="cancel-btn" @click="closeDrawer">取消</div>
          <div class="confirm-btn" type="primary" @click="submitForm(userFormRef)">确认</div>
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
export default defineComponent({
  name: 'proposal-page',
  setup() {
    const store = useStore()
    const proposalFormRef = ref()
    onMounted(() => {
      store.commit('proposal/SET_PARAMS', { active: true, page: 1, size: 20 })
      store.dispatch('proposal/fetchProposalList', store.state.proposal.params)
    })
    const formData = reactive({
      from: computed(() => store.state.global.userInfo.roster_name),
      to: '',
      value: '',
      note: ''
    })

    const rules = reactive({
      to: { required: true, message: '请输入花名', trigger: 'blur' },
      value: { required: true, message: '请选择标签', trigger: 'blur' }
    })
    const submitForm = (formEl) => {
      if (!proposalFormRef.value) return
      proposalFormRef.value.validate((valid) => {
        if (valid) {
          const params = {
            note: formData.note,
            to: formData.to,
            value: amountToNW(formData.value)
          }
          store.dispatch('proposal/fetchProposalAdd', params).then(res => {
            drawer.value = false
            store.commit('proposal/SET_PARAMS', { active: true, page: 1, size: 20 })
            store.dispatch('proposal/fetchProposalList', store.state.proposal.params)
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
    const activeTab = ref('first')
    const handleChange = (tab) => {
      store.commit('proposal/SET_PARAMS', { active: tab === 'first', page: 1, size: 20 })
      store.dispatch('proposal/fetchProposalList', store.state.proposal.params)
    }
    const voteProposal = (id) => {
      ElMessageBox.confirm('确认要同意此提案吗?')
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
      openDrawer,
      closeDrawer,
      submitForm,
      formatDate,
      formatAmount,
      voteProposal
    }
  }
})
</script>
<style lang="scss" scoped>
.proposal {
  width: 100%;
  .proposal-banner{
    margin-bottom: 20px;
    .banner{
      width: 100%;
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
    }
  }
}
</style>
