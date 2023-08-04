<template>
  <div class="token">
    <div class="token-banner">
      <img class="banner" :src="require('@/assets/image/personal-bg.png')" alt="">
    </div>
    <div class="form-wrap">
      <el-form
        ref="tokenFormRef"
        :model="formData"
        :rules="rules"
        class="submit-form"
        label-position="top"
      >
        <el-form-item label="花名" prop="username">
          <el-input v-model="formData.username" autocomplete="off" />
        </el-form-item>
        <el-form-item label="NW" prop="balance">
          <el-input v-model="formData.balance" autocomplete="off">
            <template #append>nw</template>
          </el-input>
        </el-form-item>
        <el-form-item label="备注" prop="note" class="textarea-item">
          <el-input v-model="formData.note" autocomplete="off" type="textarea" rows="3"/>
        </el-form-item>
      </el-form>
      <div class="submit-btn" @click="submitForm(tokenFormRef)">确认</div >
    </div>

  </div>
</template>
<script>
import { ref, reactive, defineComponent } from 'vue'
import { useStore } from 'vuex'
import { amountToNW } from '@/utils'
export default defineComponent({
  name: 'token-page',
  setup() {
    const store = useStore()
    const tokenFormRef = ref()
    const formData = reactive({
      username: '',
      balance: '',
      tag: '',
      note: ''
    })

    const rules = reactive({
      username: { required: true, message: '请输入花名！', trigger: 'blur' },
      balance: { required: true, message: '请输入NW！', trigger: 'blur' }
    })
    const submitForm = (formEl) => {
      if (!formEl) return
      formEl.validate((valid) => {
        if (valid) {
          const params = {
            username: formData.username,
            balance: amountToNW(formData.balance),
            note: formData.note
          }
          store.dispatch('global/fetchAirdrop', params)
        } else {
          return false
        }
      })
    }

    return {
      tokenFormRef,
      formData,
      rules,
      submitForm
    }
  }
})
</script>
<style lang="scss" scoped>
.token {
  width: 100%;
  .token-banner{
    margin-bottom: 60px;
    .banner{
      width: 100%;
    }
  }
  .form-wrap{
    width: 400px;
    margin: 0 auto 50px;
    :deep(.el-input__wrapper){
      background: #ffffff;
      border: 0.5px solid rgba(151,151,151,0.25);
      border-radius: 8px;
      box-shadow: 0px 1px 20px 0px rgba(0,0,0,0.05);
      .el-input__inner{
        height: 45px;
      }
    }
    :deep(.el-input-group--append){
      background: #ffffff;
      border: 0.5px solid rgba(151,151,151,0.25);
      border-radius: 8px;
      box-shadow: 0px 1px 20px 0px rgba(0,0,0,0.05);
      .el-input__wrapper{
        border:none;
        box-shadow: none;
        border-radius: 0;
      }
      .el-input-group__append{
        background: #ffffff;
        box-shadow:none;
        border-radius: 0 8px 8px 0;
      }
    }
    :deep(.el-textarea__inner){
      background: #ffffff;
      border: 0.5px solid rgba(151,151,151,0.25);
      border-radius: 8px;
      box-shadow: 0px 1px 20px 0px rgba(0,0,0,0.05);
    }
    :deep(.textarea-item){
      margin-bottom: 40px;
    }
    .submit-btn{
        width: 100%;
        height: 45px;
        background: #000000;
        border-radius: 12px;
        font-size: 14px;
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        margin: 0 auto;
    }
  }
}
</style>>
