<template>
  <div class="submit">
    <div class="submit-banner">
      <img class="banner" :src="require('@/assets/image/personal-bg.png')" alt="">
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
          <el-input v-model="formData.to" autocomplete="off" @blur="getAmount"/>
        </el-form-item>
        <el-form-item label="标签" prop="tag">
          <el-select v-model="formData.tag" placeholder="请选择标签" @change="getAmount">
              <el-option
                v-for="item in tagsList"
                :key="item.id"
                :label="item.tag"
                :value="item.id"
              />
            </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="note" class="textarea-item">
          <el-input v-model="formData.note" autocomplete="off" type="textarea" rows="3"/>
        </el-form-item>
        <div class="submit-tips" v-if="amount !== '0'">
        <div class="row">
          <div class="label">账户余额：</div>
          <div class="value">{{ balance }} nw</div>
        </div>
        <div class="row">
          <div class="label">燃料：</div>
          <div class="value">{{ amount }} nw</div>
        </div>
      </div>
      </el-form>

      <div class="submit-btn" @click="submitForm">确认</div >
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

    onMounted(() => {
      store.dispatch('global/fetchTagsList')
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
      to: { required: true, message: '请输入花名！', trigger: 'blur' },
      tag: { required: true, message: '请输入标签', trigger: 'blur' }
    })
    const getAmount = () => {
      if (formData.from && formData.to && formData.tag) {
        store.dispatch('submit/fetchTagsAmount', {
          from_name: formData.from,
          to_name: formData.to,
          tag_id: formData.tag
        })
      } else {
        store.commit('submit/SET_AMOUNT', '0')
      }
    }
    const submitForm = (formEl) => {
      if (!submitFormRef.value) return
      submitFormRef.value.validate((valid) => {
        if (valid) {
          const params = {
            from_name: formData.from,
            to_name: formData.to,
            tag_id: formData.tag,
            note: formData.note
          }
          store.dispatch('submit/fetchTagAppraisal', params).then(res => {
            formData.to = ''
            formData.tag = ''
            formData.note = ''
            store.commit('submit/SET_AMOUNT', '0')
            ElMessage({
              showClose: true,
              message: '成功！',
              type: 'success'
            })
          })
        } else {
          console.log('error submit!')
          return false
        }
      })
    }

    const tagsList = computed(() => store.state.global.tagsList)

    return {
      submitFormRef,
      formData,
      rules,
      tagsList,
      getAmount,
      amount,
      balance,
      submitForm
    }
  }
})
</script>
<style lang="scss" scoped>
.submit {
  width: 100%;
  padding-bottom: 40px;
  .submit-banner{
    margin-bottom: 60px;
    .banner{
      width: 100%;
    }
  }
  .form-wrap{
    width: 400px;
    margin: 0 auto;
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
      margin-bottom: 50px;
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
</style>>
