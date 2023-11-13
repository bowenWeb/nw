<template>
  <div class="submit">
    <div class="banner">
      <div class="bg">
        <div class="title">“创建数字身份，从TagX开始”</div>
        <div class="des">丰富TA的TagX可以快速了解TA的声誉</div>
      </div>
      <img class="img" :src="require('@/assets/image/cloud-bg.png')" alt="">
    </div>
    <div class="form-wrap">
      <el-form
        ref="submitFormRef"
        :model="formData"
        :rules="rules"
        class="submit-form"
        label-position="top"
      >
        <el-form-item label="From" prop="from">
          <el-input v-model="formData.from" autocomplete="off" disabled/>
        </el-form-item>
        <el-form-item label="To" prop="to">
          <el-select v-model="formData.to" filterable placeholder="请选择花名" @change="getAmount">
            <el-option
              v-for="item in rosterNames"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="TagX" prop="tag">
          <el-input v-model="formData.tag" placeholder="请输入TagX" @blur="getAmount" maxlength="8"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="note" class="textarea-item">
          <el-input v-model="formData.note" autocomplete="off" type="textarea" rows="3"/>
        </el-form-item>
        <div class="submit-tips" v-if="amount !== '0'">
          <div class="row">
            <div class="label">Balance：</div>
            <div class="value">{{ balance }} nw</div>
          </div>
          <div class="row">
            <div class="label">Gas：</div>
            <div class="value">{{ amount }} nw</div>
          </div>
        </div>
      </el-form>

      <div class="submit-btn">
        <el-button type="primary" :loading="loading" @click="submitForm">确认</el-button>
      </div >
    </div>

  </div>
</template>
<script>
import { ref, reactive, defineComponent, onMounted, computed } from 'vue'
import { useStore } from 'vuex'
import { ElMessage } from 'element-plus'
export default defineComponent({
  name: 'submit-page',
  setup() {
    const submitFormRef = ref()
    const store = useStore()
    const loading = ref(false)
    onMounted(() => {
      store.dispatch('global/fetchRosterNames')
    })
    const balance = computed(() => store.state.global.userInfo.balance)
    const amount = computed(() => store.state.submit.amount)
    const formData = reactive({
      from: computed(() => store.state.global.userInfo.roster_name),
      to: '',
      tag: '',
      note: ''
    })

    const rules = reactive({
      to: [
        { required: true, message: '请输入花名！', trigger: 'blur' },
        { pattern: /^[\u4E00-\u9FA5A-Za-z]+$/, message: '请输入中文、英文字符！', trigger: 'blur' }
      ],
      tag: { required: true, message: '请输入TagX', trigger: 'blur' }
    })
    const getAmount = () => {
      if (formData.from && formData.to && formData.tag) {
        store.dispatch('submit/fetchTagsAmount', {
          from_name: formData.from,
          to_name: formData.to,
          tag: formData.tag
        })
      } else {
        store.commit('submit/SET_AMOUNT', '0')
      }
    }
    const submitForm = (formEl) => {
      if (!submitFormRef.value) return
      if (loading.value) return
      submitFormRef.value.validate((valid) => {
        if (valid) {
          loading.value = true
          const params = {
            from_name: formData.from,
            to_name: formData.to,
            tag: formData.tag,
            note: formData.note
          }
          store.dispatch('submit/fetchTagAppraisal', params).then(res => {
            loading.value = false
            formData.to = ''
            formData.tag = ''
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
          console.log('error submit!')
          loading.value = false
          return false
        }
      })
    }

    return {
      submitFormRef,
      formData,
      rules,
      getAmount,
      amount,
      balance,
      tagsList: computed(() => store.state.global.tagsList),
      rosterNames: computed(() => store.state.global.rosterNames),
      submitForm,
      loading
    }
  }
})
</script>
<style lang="scss" scoped>
.submit {
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
      align-items:center;
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
    :deep(.el-input__wrapper){
      background: #ffffff;
      border: 0.5px solid rgba(151,151,151,0.25);
      border-radius: 8px;
      box-shadow: 0px 1px 20px 0px rgba(0,0,0,0.05);
      .el-input__inner{
        height: 45px;
      }
    }
    :deep(.el-textarea__inner){
      background: #ffffff;
      border: 0.5px solid rgba(151,151,151,0.25);
      border-radius: 8px;
      box-shadow: 0px 1px 20px 0px rgba(0,0,0,0.05);
    }
    .submit-form{
      width: 400px;
      margin-bottom: 50px;
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

  .submit-tips{
    .row{
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 10px;
      font-size: 14px;
      font-family: PingFang SC, PingFang SC-Semibold;
      font-weight: 600;
      text-align: center;
      color: #656e76;
      line-height: 20px;
    }
  }
}
</style>
