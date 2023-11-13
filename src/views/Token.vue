<template>
  <div class="token">
    <div class="banner">
      <div class="bg">
        <div class="title">“特别空投 特别奖励 基于特别”</div>
        <div class="des">公益时长、竞赛冠军、突出贡献……、特别奖励</div>
      </div>
      <img class="img" :src="require('@/assets/image/cloud-bg.png')" alt="">
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
          <el-select v-model="formData.username" filterable placeholder="请选择花名">
            <el-option
              v-for="item in rosterNames"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="NW" prop="balance">
          <el-input v-model="formData.balance" autocomplete="off" :formatter="inputLimit">
            <template #append>nw</template>
          </el-input>
        </el-form-item>
        <el-form-item label="备注" prop="note" class="textarea-item">
          <el-input v-model="formData.note" autocomplete="off" type="textarea" rows="3"/>
        </el-form-item>
      </el-form>
      <div class="submit-btn">
        <el-button type="primary" :loading="loading" @click="submitForm(tokenFormRef)">确认</el-button>
      </div >
    </div>

  </div>
</template>
<script>
import { ref, reactive, defineComponent, onMounted, computed } from 'vue'
import { useStore } from 'vuex'
import { amountToNW } from '@/utils'
import { ElMessage } from 'element-plus'
export default defineComponent({
  name: 'token-page',
  setup() {
    const store = useStore()
    const tokenFormRef = ref()
    const loading = ref(false)
    const formData = reactive({
      username: '',
      balance: '',
      tag: '',
      note: ''
    })
    const oldValue = ref('')
    const rules = reactive({
      username: [
        { required: true, message: '请输入花名！', trigger: 'blur' },
        { pattern: /^[\u4E00-\u9FA5A-Za-z]+$/, message: '请输入中文、英文字符！', trigger: 'blur' }
      ],
      balance: { required: true, message: '请输入NW！', trigger: 'blur' }
    })
    onMounted(() => {
      store.dispatch('global/fetchRosterNames')
    })
    const submitForm = (formEl) => {
      if (!formEl) return
      if (loading.value) return
      formEl.validate((valid) => {
        if (valid) {
          loading.value = true
          const params = {
            username: formData.username,
            balance: amountToNW(formData.balance),
            note: formData.note
          }
          store.dispatch('global/fetchAirdrop', params).then(res => {
            loading.value = false
            formData.username = ''
            formData.balance = ''
            formData.note = ''
            store.commit('submit/SET_AMOUNT', '0')
            ElMessage({
              showClose: true,
              message: '成功！',
              type: 'success'
            })
          }).catch(error => {
            console.log(error, 'error submit!')
            loading.value = false
          })
        } else {
          loading.value = false
          return false
        }
      })
    }

    const inputLimit = (value) => {
      if (/^[0-9]*[.]?[0-9]*$/.test(value)) {
        oldValue.value = value
        return value
      } else {
        return oldValue
      }
    }

    return {
      tokenFormRef,
      formData,
      rules,
      rosterNames: computed(() => store.state.global.rosterNames),
      submitForm,
      inputLimit,
      loading
    }
  }
})
</script>
<style lang="scss" scoped>
.token {
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  .banner{
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
  .form-wrap{
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px 0;
    :deep(.el-form){
      width: 400px;
    }
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
      width: 400px;
      :deep(.el-button){
        width: 400px;
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
        border: none;
      }
    }
  }
}
</style>
