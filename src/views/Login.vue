<template>
  <div class="login">
    <div class="bg">
      <img :src="require('@/assets/image/login/image-bg.png')" alt="" />
    </div>
    <div class="line top"></div>
    <div class="line bottom"></div>

    <div class="left">
      <div class="row" v-if="tagsList.length >=1">
        <div class="tag" :title="lodash.get(tagsList,'[0].tag','')">
          {{ truncateString(lodash.get(tagsList,'[0].tag','')) }}
        </div>
        <img :src="require('@/assets/image/login/line-bg-1.png')" />
        <div class="tag" :title="lodash.get(tagsList,'[1].tag','')">
          {{ truncateString(lodash.get(tagsList,'[1].tag','')) }}
        </div>
      </div>
      <div class="row" v-if="tagsList.length >=3">
        <div class="tag" :title="lodash.get(tagsList,'[2].tag','')">
          {{ truncateString(lodash.get(tagsList,'[2].tag','')) }}
        </div>
        <img :src="require('@/assets/image/login/line-bg-2.png')" />
        <div class="tag" :title="lodash.get(tagsList,'[3].tag','')">
          {{ truncateString(lodash.get(tagsList,'[3].tag','')) }}
        </div>

      </div>
      <div class="row" v-if="tagsList.length >=5">
        <img :src="require('@/assets/image/login/line-bg-4.png')" />
        <div class="tag" :title="lodash.get(tagsList,'[4].tag','')">
          {{ truncateString(lodash.get(tagsList,'[4].tag','')) }}
        </div>
      </div>
      <div class="row"  v-if="tagsList.length >=6">
        <div class="tag" :title="lodash.get(tagsList,'[5].tag','')">
          {{ truncateString(lodash.get(tagsList,'[5].tag','')) }}
        </div>

        <div class="group">
          <img :src="require('@/assets/image/login/line-bg-3.png')" />
          <div class="tag" :title="lodash.get(tagsList,'[6].tag','')">
            {{ truncateString(lodash.get(tagsList,'[6].tag','')) }}
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
          <el-form-item label="用户名" prop="username">
            <el-input v-model="loginForm.username" autocomplete="off" />
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input
              v-model="loginForm.password"
              type="password"
              autocomplete="off"
              show-password
            />
          </el-form-item>
        </el-form>
        <div class="login-btn" @click="submitForm">
          <span class="text">登录</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { defineComponent, ref, reactive, onMounted, computed } from 'vue'
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
    onMounted(() => {
      store.dispatch('global/fetchTagsList')
    })
    const loginFormRef = ref()
    const loginForm = reactive({
      username: 'admin',
      password: 'abc123'
    })

    const rules = reactive({
      username: { required: true, message: '请输入用户名！', trigger: 'blur' },
      password: { required: true, message: '请输入密码', trigger: 'blur' }
    })

    const submitForm = (formEl) => {
      if (!loginFormRef.value) return
      loginFormRef.value.validate((valid) => {
        if (valid) {
          console.log(loginForm.username, 'submit!')
          store.dispatch('login/fetchLogin', {
            username: loginForm.username,
            password: loginForm.password
          }).then(res => {
            Cookies.setKey(SESSION_TOKEN, res)
            Cookies.setKey(USER_NAME, loginForm.username)
            router.push('/')
          })
        } else {
          console.log('error submit!')
          return false
        }
      })
    }

    return {
      loginFormRef,
      loginForm,
      rules,
      tagsList: computed(() => store.state.global.tagsList),
      submitForm,
      truncateString,
      lodash: _
    }
  }
})
</script>
<style lang="scss"  scoped>
.login{
  height: 100%;
  position: relative;
  display: flex;
  background: #F5F6FD;
  min-width: 1500px;
  overflow-x: auto;
  .left{
    flex:1;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    .row{
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 30px;
      &:nth-child(1){
        padding-left: 12%;
      }
      &:nth-child(2){
        padding-left: 5%;
      }
      &:nth-child(4){
        padding-left: 15%;
      }
      .tag{
        font-size: 50px;
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
    padding-right:100px;
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
        border-radius: 12px;
        padding: 6px 20px;
        border: none;
      }

      .login-btn{
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
        transition: all .2s linear;
        &:hover{
          background: #ffffff;
          color: #000000;
          &::before,&:after{
            width: 100%;
            transition-delay: .2s
          }
          .text{
            &::before,&::after{
              height: 100%;
              transition-delay: 0s
            }
          }
        }
        &::before,&::after{
          content: "";
          width: 0;
          height: 2px;
          position: absolute;
          transition: all .2s linear;
          background: #000000;
          transition-delay: 0s
        }
        &::before{
          right: 0;
          top: 0
        }
        &::after{
          left: 0;
          bottom: 0
        }
        .text{
          &::before,&::after{
            content: "";
            width: 2px;
            height: 0;
            position: absolute;
            transition: all .2s linear;
            background: #000000;
            transition-delay: .2s
          }
          &::before{
            left: 0;
            top: 0
          }
          &::after{
            right: 0;
            bottom: 0
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
      left: 30%;
      border-image: linear-gradient(0deg, #ffbe25 1%, rgba(247,219,152,0.00)) 1.5 1.5;
    }
  }
}
</style>>
