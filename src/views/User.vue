<template>
  <div class="user">

    <div class="banner">
      <div class="bg">
        <div class="title">欢迎加入焜耀</div>
        <div class="des">加入焜耀是一件幸运的事</div>
      </div>
      <img class="img" :src="require('@/assets/image/cloud-bg-2.png')" alt="">
    </div>
    <div class="user-content content-width">
      <div class="table-action">
        <div class="title">用户列表</div>
        <div class="confirm-btn" @click="openDrawer">添加</div>
      </div>
      <div class="user-table">
        <div class="table">
          <el-table border :data="filterTableData"  style="width: 100%">
            <el-table-column prop="name" label="姓名" width="180" />
            <el-table-column prop="roster_name" label="花名" width="180" />
            <el-table-column prop="onboarding_at" label="入职时间">
              <template #default="scope">
                {{formatDate(scope.row.onboarding_at)}}
              </template>
            </el-table-column>
            <el-table-column prop="formal" label="转正时间" >
              <template #default="scope">
                {{formatDate(scope.row.formal)}}
              </template>
            </el-table-column>
            <el-table-column>
              <template #header>
                <el-input v-model="search" size="small" placeholder="输入花名搜索" />
              </template>
              <template #default="scope">
                <div class="table-row-action">
                  <span class="action" @click="editUser(scope.row)">编辑</span>
                  <span class="delete" @click="deleteUser(scope.row.roster_name)">删除</span>
                </div>
              </template>
            </el-table-column>

          </el-table>
        </div>
        <!-- <div class="pagination">
          <el-pagination background layout="prev, pager, next" :current-page="params.page" :page-size="params.size" :total="total" @current-change="handleCurrentChange"/>
        </div> -->
      </div>
    </div>
    <el-drawer v-model="drawer"
      title="添加用户"
      :before-close="closeDrawer"
    >

      <template #default>
        <el-form
          ref="userFormRef"
          :model="formData"
          :rules="rules"
          class="user-form"
          label-position="top"
        >

          <el-form-item label="姓名" prop="username">
            <el-input v-model="formData.username" autocomplete="off" placeholder="请输入姓名" :disabled="formData.ID?true:false"/>
          </el-form-item>
          <el-form-item label="花名" prop="roster_name">
            <el-input v-model="formData.roster_name" autocomplete="off" placeholder="请输入花名" :disabled="formData.ID?true:false"/>
          </el-form-item>
          <el-form-item label="密码" prop="password" v-if="!formData.ID">
            <el-input v-model="formData.password" autocomplete="off" type="password" placeholder="请输入密码" show-password/>
          </el-form-item>

          <el-form-item label="入职时间" prop="onboarding_at" >
            <el-date-picker
              v-model="formData.onboarding_at"
              type="date"
              placeholder="请选择入职时间"
            />
          </el-form-item>
          <el-form-item label="转正时间" prop="formal">
            <el-date-picker
              v-model="formData.formal"
              type="date"
              placeholder="请选择转正时间"
            />
          </el-form-item>
        </el-form>
      </template>
      <template #footer>
        <div class="btn-group">
          <div class="cancel-btn" @click="closeDrawer">取消</div>
          <div class="confirm-btn" @click="addUser(userFormRef)">
            <el-button type="primary" :loading="loading" @click="addUser(userFormRef)">确认</el-button>
          </div>
        </div>
      </template>
    </el-drawer>
  </div>
</template>
<script>
import { defineComponent, reactive, ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import dayjs from 'dayjs'
import { ElMessageBox, ElMessage } from 'element-plus'
import { formatDate } from '@/utils/date'
export default defineComponent({
  name: 'user-page',
  setup() {
    const store = useStore()
    onMounted(() => {
      store.dispatch('user/fetchJobCategory')
      store.commit('user/SET_PARAMS', { page: 1, size: 20 })
      store.dispatch('user/fetchUserList', store.state.user.params)
    })
    const drawer = ref(false)
    const userFormRef = ref()
    const search = ref('')
    const loading = ref()
    const filterData = reactive({
      name: ''
    })
    const formData = reactive({
      ID: 0,
      // 姓名
      username: '',
      // 花名
      roster_name: '',
      // 密码
      password: '',
      // 入职时间
      onboarding_at: '',
      // 转正时间
      formal: ''
    })

    const rules = reactive({
      username: [
        { required: true, message: '请输入姓名！', trigger: 'blur' },
        { pattern: /^[\u4E00-\u9FA5A-Za-z]+$/, message: '请输入中文、英文字符！', trigger: 'blur' }
      ],
      roster_name: [
        { required: true, message: '请输入花名！', trigger: 'blur' },
        { pattern: /^[\u4E00-\u9FA5A-Za-z]+$/, message: '请输入中文、英文字符！', trigger: 'blur' }
      ],
      password: { required: true, message: '请输入密码！', trigger: 'blur' },
      formal: { required: true, message: '请选择转正时间！', trigger: 'blur' },
      onboarding_at: { required: true, message: '请选择入职时间！', trigger: 'blur' }
    })
    const addUser = (formEl) => {
      if (!formEl) return
      if (loading.value) return
      formEl.validate((valid) => {
        if (valid) {
          loading.value = true
          if (formData.ID) {
            const params = {
              username: formData.roster_name,
              onboarding_at: dayjs(formData.onboarding_at).format('YYYY-MM-DD'),
              formal: dayjs(formData.formal).format('YYYY-MM-DD')
            }
            store.dispatch('user/fetchUserSet', params).then(res => {
              closeDrawer()
              ElMessage({
                showClose: true,
                message: '成功！',
                type: 'success'
              })
              store.commit('user/SET_PARAMS', { page: 1, size: 20 })
              store.dispatch('user/fetchUserList', store.state.user.params)
              loading.value = false
            }).catch(error => {
              loading.value = false
              console.log(error, 'error')
            })
          } else {
            const params = [{
              username: formData.username,
              roster_name: formData.roster_name,
              password: formData.password,
              onboarding_at: dayjs(formData.onboarding_at).format('YYYY-MM-DD'),
              formal: dayjs(formData.formal).format('YYYY-MM-DD')
            }]
            store.dispatch('user/fetchUserAdd', params).then(res => {
              closeDrawer()
              ElMessage({
                showClose: true,
                message: '成功！',
                type: 'success'
              })
              store.commit('user/SET_PARAMS', { page: 1, size: 20 })
              store.dispatch('user/fetchUserList', store.state.user.params)
              loading.value = false
            }).catch(error => {
              loading.value = false
              console.log(error, 'error')
            })
          }
        } else {
          console.log('error submit!')
          return false
        }
      })
    }

    const editUser = (row) => {
      console.log(row, 'row 111')
      formData.ID = row.ID ?? 0
      formData.username = row.name ?? ''
      formData.roster_name = row.roster_name ?? ''
      formData.onboarding_at = row.onboarding_at ?? ''
      formData.formal = row.formal ?? ''
      openDrawer()
    }

    const deleteUser = (username) => {
      ElMessageBox.confirm('确认要删除此账户吗?')
        .then(() => {
          store.dispatch('user/fetchUserDelete', username).then(res => {
            ElMessage({
              showClose: true,
              message: '删除成功！',
              type: 'success'
            })
            store.commit('user/SET_PARAMS', { page: 1, size: 20 })
            store.dispatch('user/fetchUserList', store.state.user.params)
          })
        })
        .catch(() => {
          // catch error
        })
    }

    const openDrawer = () => {
      drawer.value = true
    }
    const closeDrawer = () => {
      drawer.value = false
      resetForm()
    }
    const resetForm = () => {
      formData.ID = 0
      formData.username = ''
      formData.roster_name = ''
      formData.password = ''
      formData.onboarding_at = ''
      formData.formal = ''
      if (!userFormRef.value) return
      userFormRef.value.resetFields()
    }
    const handleCurrentChange = (page) => {
      store.commit('user/SET_PARAMS', {
        page,
        size: 20
      })
      store.dispatch('user/fetchUserList', store.state.user.params)
    }
    return {
      drawer,
      filterData,
      formData,
      openDrawer,
      closeDrawer,
      rules,
      userFormRef,
      addUser,
      jobs: computed(() => store.state.user.jobs),
      userList: computed(() => store.state.user.userList),
      search,
      filterTableData: computed(() =>
        store.state.user.userList.filter(
          (data) =>
            !search.value ||
            data.roster_name.toLowerCase().includes(search.value.toLowerCase())
        )
      ),
      total: computed(() => store.state.user.total),
      params: computed(() => store.state.user.params),
      formatDate,
      editUser,
      handleCurrentChange,
      deleteUser,
      loading
    }
  }
})
</script>
<style lang="scss" scoped>
.user {
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

  .user-content{
    .filters{
      display: flex;
      align-items: center;
      padding: 50px 0 80px;
      column-gap: 30px;
      .filter-item{
        .label{
          font-size: 16px;
          font-family: PingFang SC, PingFang SC-Medium;
          font-weight: 500;
          text-align: left;
          color: #000000;
          line-height: 22px;
          margin-bottom: 12px;
        }
      }
    }
    .table-action{
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      .title{
        font-size: 16px;
        font-family: WDCH, WDCH-Regular;
        font-weight: 600;
        color: #000000;
        line-height: 49px;
      }
    }
    .user-table{
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
  :deep(.el-input){
    .el-input__wrapper{
      height: 36px;
      padding: 0 15px;
    }
  }
}
</style>
