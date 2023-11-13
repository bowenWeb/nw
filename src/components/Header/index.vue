<template>
  <div class="header">
    <div class="content-width">
      <div class="left" @click="goPage('/')">
        <img class="logo" :src="require(`@/assets/image/logo-black.png`)" alt="">
      </div>
      <div class="right">
        <el-dropdown trigger="click" v-if="username">
          <div class="username">
            <span>hi,{{ username }}</span>
            <el-icon><User /></el-icon>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="goPage('/personal')">个人中心</el-dropdown-item>
              <el-dropdown-item @click="goPage('/user')" v-if="role === 'admin'">用户管理</el-dropdown-item>
              <el-dropdown-item @click="goPage('/tags')" v-if="role === 'admin'">标签管理</el-dropdown-item>
              <el-dropdown-item @click="openPassword">修改密码</el-dropdown-item>
              <el-dropdown-item @click="loginOut">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <div class="login-btn" v-else @click="goPage('/login')">
          登录
        </div>
      </div>
    </div>

    <el-drawer v-model="drawer"
      title="修改密码"
      :before-close="closeDrawer"
    >
      <template #default>
        <el-form
          ref="passwordFormRef"
          :model="formData"
          :rules="rules"
          class="user-form"
          label-position="top"
        >
          <el-form-item label="花名" prop="username">
            <el-input v-model="formData.username" autocomplete="off" placeholder="请输入花名" disabled/>
          </el-form-item>
          <el-form-item label="旧密码" prop="currpassword">
            <el-input v-model="formData.currpassword" autocomplete="off" type="password" placeholder="请输入旧密码" show-password/>
          </el-form-item>
          <el-form-item label="新密码" prop="newpassword">
            <el-input v-model="formData.newpassword" autocomplete="off" type="password" placeholder="请输入新密码" show-password/>
          </el-form-item>
          <el-form-item label="确认密码" prop="confrimpassword">
            <el-input v-model="formData.confrimpassword" autocomplete="off" type="password" placeholder="请输入确认密码" show-password/>
          </el-form-item>
        </el-form>
      </template>
      <template #footer>
        <div class="btn-group">
          <div class="cancel-btn" @click="closePassword">取消</div>
          <div class="confirm-btn">
            <el-button type="primary" :loading="loading" @click="modifyPassword(passwordFormRef)">确认</el-button>
          </div>
        </div>
      </template>
    </el-drawer>

  </div>
</template>

<script>
import { defineComponent, ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Cookies, SESSION_TOKEN, USER_NAME } from '@/utils/cookie'
// import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import { ElMessage } from 'element-plus'
export default defineComponent({
  name: 'header-component',
  setup() {
    // const { locale } = useI18n()
    // const language = ref(locale.value)
    const store = useStore()
    const router = useRouter()
    const loading = ref(false)
    const username = Cookies.getKey(USER_NAME)
    const drawer = ref(false)
    const passwordFormRef = ref()
    const formData = reactive({
      username: computed(() => store.state.global.userInfo.roster_name),
      currpassword: '',
      newpassword: '',
      confrimpassword: ''
    })

    const validateConfirmPassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入确认密码！'))
      } else if (value !== formData.newpassword) {
        callback(new Error('两次输入密码不一致！'))
      } else {
        callback()
      }
    }

    const rules = reactive({
      currpassword: { required: true, message: '请输入旧密码！', trigger: 'blur' },
      newpassword: { required: true, message: '请输入新密码！', trigger: 'blur' },
      confrimpassword: [{ validator: validateConfirmPassword, trigger: 'blur' }]
    })

    const loginOut = () => {
      store.dispatch('login/fetchLogout').then(res => {
        Cookies.deleteKey(USER_NAME)
        Cookies.deleteKey(SESSION_TOKEN)
        router.push('/login')
      })
    }
    const goPage = (path) => {
      router.push(path)
    }

    // const changeLanguage = (lang) => {
    //   localStorage.setItem('nw-language', lang)
    //   locale.value = lang
    //   language.value = lang
    // }

    const resetForm = () => {
      formData.currpassword = ''
      formData.newpassword = ''
      formData.confrimpassword = ''
      if (!passwordFormRef.value) return
      passwordFormRef.value.resetFields()
    }
    const closePassword = () => {
      drawer.value = false
      resetForm()
    }
    const openPassword = () => {
      drawer.value = true
    }
    const modifyPassword = (formEl) => {
      if (!formEl) return
      if (loading.value) return
      formEl.validate((valid) => {
        if (valid) {
          loading.value = true
          const params = {
            username: formData.username,
            currpassword: formData.currpassword,
            newpassword: formData.newpassword
          }
          store.dispatch('user/fetchPassword', params).then(res => {
            loading.value = false
            closePassword()
            ElMessage({
              showClose: true,
              message: '修改成功，即将跳转登录页面',
              type: 'success'
            })
            setTimeout(() => {
              loginOut()
            }, 3000)
          }).catch(error => {
            loading.value = false
            console.log(error, 'error')
          })
        } else {
          loading.value = false
          console.log('error submit!')
          return false
        }
      })
    }

    return {
      role: computed(() => store.state.global.userInfo?.role),
      drawer,
      passwordFormRef,
      formData,
      rules,
      closePassword,
      openPassword,
      loginOut,
      goPage,
      username,
      modifyPassword,
      loading
      // locale,
      // changeLanguage,
      // language
    }
  }
})
</script>

<style lang="scss" scoped>
.header {
  flex-shrink: 0;
  width: 100%;
  background: #ffffff;
  position: sticky;
  top:0;
  left: 0;
  z-index: 99;
  .content-width{
    height: 65px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .left{
      .logo{
        cursor: pointer;
        width: 180px;
      }
    }
    .right{
      display: flex;
      align-items: center;
      justify-content: space-between;
      column-gap: 20px;
      .login-btn{
        width: 100px;
        height: 35px;
        background: #000000;
        border-radius: 18px;
        font-size: 16px;
        font-family: PingFang SC, PingFang SC-Regular;
        font-weight: 400;
        text-align: left;
        color: #ffffff;
        line-height: 35px;
        text-align: center;
        cursor: pointer;
      }
      .username{
        display: flex;
        align-items: center;
        column-gap: 10px;
        font-size: 14px;
        color: #151515;
        font-weight: 600;
      }
      :deep(.el-dropdown){
        color: #151515;
        font-weight: 600;
        cursor: pointer;
        &:focus-visible {
          outline: none;
        }
        .el-icon{
          font-size: 16px;
          color: #151515;
          font-weight: 600;
          cursor: pointer;
          border: none;
          &:focus-visible {
            outline: none;
          }
          &:hover{
            border: none;
          }
        }
      }
    }
  }

  :deep(.el-drawer){
    .el-form-item{
      margin-bottom: 24px;
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
