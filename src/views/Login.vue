<template>
  <div class="login">
    <div class="bg">
      <img :src="require('@/assets/image/login/image-bg.png')" alt="" />
    </div>

    <div class="logo">
      <img :src="require('@/assets/image/logo-black.png')" />
    </div>
    <div class="content">
      <div class="left">
        <div class="tags-box">
          <!-- <div class="top"></div>
          <div class="bottom"></div>
          <div class="left"></div>
          <div class="right"></div> -->
          <div class="tags-list">
            <div class="tag"
              v-for="(item,index) in tagsList.slice(0,32)" :key="index"
              :style="[
                { background:colors[index%4].color },
                { border:`1px solid ${colors[index%4].border}` }
              ]"
            >
              {{ item.tag }}
            </div>
          </div>
        </div>

    </div>
    <div class="right">
      <div class="form">
        <div class="title">登录</div>
        <el-form
          ref="loginFormRef"
          :model="loginForm"
          :rules="rules"
          class="demo-ruleForm"
          label-position="top"
        >
          <el-form-item label="花名" prop="username">
            <el-input v-model.trim="loginForm.username" autocomplete="off" placeholder="请输入花名"/>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input
              v-model.trim="loginForm.password"
              type="password"
              autocomplete="off"
              show-password
              placeholder="请输入密码"
            />
          </el-form-item>
        </el-form>
        <div class="login-btn">
          <el-button type="primary" :loading="loading" @click="submitForm">登录</el-button>
        </div>
      </div>
    </div>
    </div>

  </div>
</template>
<script>
import { defineComponent, ref, reactive, onMounted, computed, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { Cookies, SESSION_TOKEN, USER_NAME } from '@/utils/cookie'
import { useStore } from 'vuex'
import _ from 'lodash-es'
import { truncateString } from '@/utils'
export default defineComponent({
  name: 'login-page',
  setup() {
    const router = useRouter()
    const store = useStore()
    const loading = ref(false)
    onMounted(() => {
      store.dispatch('global/fetchTagsList', { tag_type: '', block: false })
      window.addEventListener('keyup', keyEnter, false)
    })

    onUnmounted(() => {
      window.removeEventListener('keyup', keyEnter, false)
    })
    const loginFormRef = ref()
    const loginForm = reactive({
      username: '',
      password: ''
    })

    const rules = reactive({
      username: [
        { required: true, message: '请输入花名！', trigger: 'blur' },
        { pattern: /^[\u4E00-\u9FA5A-Za-z]+$/, message: '请输入中文、英文字符！', trigger: 'blur' }
      ],
      password: { required: true, message: '请输入密码', trigger: 'blur' }
    })

    const keyEnter = (e) => {
      if (e.keyCode === 13 || e.keyCode === 100) {
        submitForm()
      }
    }

    const submitForm = () => {
      if (!loginFormRef.value) return
      if (loading.value) return
      loginFormRef.value.validate((valid) => {
        if (valid) {
          loading.value = true
          store.dispatch('login/fetchLogin', {
            username: loginForm.username,
            password: loginForm.password
          }).then(res => {
            loading.value = false
            Cookies.setKey(SESSION_TOKEN, res)
            Cookies.setKey(USER_NAME, loginForm.username)
            router.push('/')
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

    const colors = [
      {
        color: '#e4ffee', border: '#99E1B3'
      },
      {
        color: '#fff7dd', border: '#F5DC8B'
      },
      {
        color: '#fedddd', border: '#E49797'
      },
      {
        color: '#f4e3ff', border: '#B889D7'
      }
    ]

    return {
      loginFormRef,
      loginForm,
      rules,
      tagsList: computed(() => store.state.global.tagsList),
      submitForm,
      truncateString,
      colors,
      lodash: _,
      loading
    }
  }
})
</script>
<style lang="scss"  scoped>
.login{
  height: 100%;
  position: relative;
  background: #F5F6FD;
  min-width: 1360px;
  overflow-x: auto;
  .logo{
    position: absolute;
    top: 50px;
    left: 50px;
    width: 208px;
    margin: 0 auto 30px;
    img{
      width: 100%;
    }
  }
  .content{
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding-right: 100px;
    height: 100%;
  }
  .left{
    flex:1;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    background: radial-gradient(circle, #fff, #F5F6FD);
    height: 100%;
    .tags-list{
      display: flex;
      align-items: center;
      justify-content: flex-start;
      flex-wrap: wrap;
      column-gap: 20px;
      position: relative;
      padding: 100px;
      .tag{
        font-size: 20px;
        color: #000;
        font-weight: bold;
        padding: 12px 25px;
        border-radius: 30px;
        margin-bottom: 30px;
        cursor: pointer;
        transition: all 0.3s;
        &:hover{
          transform: scale(1.1);
        }
      }
    }
    .row-group{
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      padding-left: 20px;
      box-sizing: border-box;
    }
    .row{
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 30px;
      &.pl12{
        padding-left: 12%;
      }
      &.pl5{
        padding-left: 5%;
      }
      .tag{
        font-size: 36px;
        font-family: zihunbiantaoti, zihunbiantaoti-Regular;
        font-weight: bolder;
        color: #0a1625;
        line-height: 72px;
        text-shadow: 0px 1px 4px 0px #ffffff;
      }
      img{
        height: 76px;
        margin: 0 10px;
      }
      .group{
        position: relative;
        padding-left: 90px;
        .tag{
          position: relative;
          z-index: 3;
        }
        img{
          position: absolute;
          left: 0;
          top: 0;
          z-index: 2;
        }
      }
    }
  }
  .right{
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    .form{
      position: relative;
      width: 400px;
      background: var(--color-FFFFFF);
      padding: 40px 30px;
      border-radius: 10px;
      box-shadow: 0px 0px 15px -5px rgba(205, 205, 205, 0.2);
      z-index: 10;
      box-sizing: border-box;
      .title{
        font-size: 30px;
        font-family: Source Han Sans SC, Source Han Sans SC-Bold;
        font-weight: 700;
        text-align: left;
        color: #030201;
        line-height: 30px;
        margin-bottom: 60px;
      }
      :deep(.el-form){
        margin-bottom: 80px;
      }

      :deep(.el-form-item){
        margin-bottom: 30px;
      }
      :deep(.el-form-item__error){
        padding-top: 5px;
      }
      :deep(.el-form-item__label){
        font-size: 14px;
        font-family: Source Han Sans SC, Source Han Sans SC-Bold;
        font-weight: 700;
        text-align: left;
        color: #111029;
        line-height: 14px;
        margin-bottom: 14px;
        &:before{
          display: none;
        }
      }
      :deep(.el-input__wrapper){
        background: rgba(244, 244, 244, 0.8);
        border-radius: 0px;
        padding: 6px 20px;
        border: none;
      }

      .login-btn{
        :deep(.el-button){
          width: 100%;
          height: 50px;
          background: #000000;
          font-size: 14px;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          position: relative;
          transition: all 0.3s linear;
          border-radius: 5px;
          &:hover{
            transform: scale(1.03);
            color: rgba(255,255,255,.74);
            background-color: #171819;
            box-shadow: 0 0 rgba(0,0,0,.15);
          }
        }
      }
    }
  }
  .bg{
    position: absolute;
    right: 0;
    bottom: 0;
  }
  .line{
    width: 0px;
    height: 248px;
    border: 1px solid;
    &.top{
      position: absolute;
      top: 0;
      left: 20%;
      border-image: linear-gradient(180deg, #ffbe25 1%, rgba(247,219,152,0.00)) 1.5 1.5;
    }
    &.bottom{
      position: absolute;
      bottom: 0;
      left: 40%;
      border-image: linear-gradient(0deg, #ffbe25 1%, rgba(247,219,152,0.00)) 1.5 1.5;
    }
  }
}
</style>
