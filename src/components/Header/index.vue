<template>
  <div class="header">
    <div class="content-width">
      <div class="left" @click="goPage('/')">声誉系统</div>
      <div class="right">
        <el-dropdown trigger="click">
          <span>{{ locale === 'en' ? "English":"中文" }}</span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="changeLanguage('zh')">中文</el-dropdown-item>
              <el-dropdown-item @click="changeLanguage('en')">English</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <el-dropdown trigger="click" v-if="username">
          <div class="username">
            <span>hi,{{ username }}</span>
            <el-icon><User /></el-icon>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="goPage('/personal')">个人中心</el-dropdown-item>
              <el-dropdown-item @click="goPage('/user')">用户管理</el-dropdown-item>
              <el-dropdown-item @click="goPage('/tags')">标签管理</el-dropdown-item>
              <el-dropdown-item @click="loginOut">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <div class="login-btn" v-else @click="goPage('/login')">
          登录
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Cookies, SESSION_TOKEN, USER_NAME } from '@/utils/cookie'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
export default defineComponent({
  name: 'header-component',
  setup() {
    const { locale } = useI18n()
    const store = useStore()
    const language = ref(locale.value)
    const router = useRouter()
    const username = Cookies.getKey(USER_NAME)

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

    const changeLanguage = (lang) => {
      localStorage.setItem('nw-language', lang)
      locale.value = lang
      language.value = lang
    }

    return {
      locale,
      loginOut,
      goPage,
      username,
      changeLanguage,
      language
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
      font-size: 18px;
      cursor: pointer;
      color: #151515;
      font-weight: bolder;
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

}
</style>
