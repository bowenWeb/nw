<template>
  <div class="tags">
    <div class="banner">
      <div class="bg">
        <div class="title">Tag，就是我想说的！</div>
        <div class="des">去做Tag，不被定义的Tag,答案在Tag里，自由在风里</div>
      </div>
      <img class="img" :src="require('@/assets/image/cloud-bg-2.png')" alt="">
    </div>
    <div class="tags-content content-width">
      <div class="table-action">
        <div class="title">TagX列表</div>
        <div class="confirm-btn" @click="openDrawer">添加</div>
      </div>
      <div class="tags-table">
        <div class="table">
          <el-table border :data="tagsList"  style="width: 100%">
            <el-table-column prop="tag" label="tag" />
            <el-table-column prop="note" label="备注" />
            <el-table-column label="操作">
              <template #default="scope">
                <div class="table-row-action">
                  <span class="delete" @click="deleteTag(scope.row.tag)">删除</span>
                  <span v-if="scope.row.block">已屏蔽 </span>
                  <span class="delete" v-else  @click="manageTag(scope.row.tag)">屏蔽</span>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <el-drawer v-model="drawer"
      title="添加TagX"
      :before-close="closeDrawer"
    >

      <template #default>
        <el-form
          ref="tagFormRef"
          :model="formData"
          :rules="rules"
          class="tag-form"
          label-position="top"
        >

          <el-form-item label="TagX" prop="tag">
            <el-input v-model="formData.tag" autocomplete="off" placeholder="请输入TagX" maxlength="8"/>
          </el-form-item>
          <el-form-item label="备注" prop="note">
          <el-input v-model="formData.note" autocomplete="off" type="textarea" rows="3"/>
          </el-form-item>
        </el-form>
      </template>
      <template #footer>
        <div class="btn-group">
          <div class="cancel-btn" @click="closeDrawer">取消</div>
          <div class="confirm-btn">
            <el-button type="primary" :loading="loading" @click="addTag(tagFormRef)">确认</el-button>
          </div>
        </div>
      </template>
    </el-drawer>
  </div>
</template>
<script>
import { defineComponent, reactive, ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { ElMessageBox, ElMessage } from 'element-plus'
export default defineComponent({
  name: 'user-page',
  setup() {
    const store = useStore()
    onMounted(() => {
      store.dispatch('global/fetchTagsList', { tag_type: '', block: '' })
    })
    const drawer = ref(false)
    const tagFormRef = ref()
    const loading = ref()
    const formData = reactive({
      note: '',
      tag: ''
    })

    const rules = reactive({
      tag: { required: true, message: '请输入TagX！', trigger: 'blur' }
    })
    const addTag = (formEl) => {
      if (!formEl) return
      if (loading.value) return
      formEl.validate((valid) => {
        if (valid) {
          loading.value = true
          const params = {
            tag: formData.tag,
            note: formData.note,
            op: 'add',
            tag_type: 0
          }
          store.dispatch('tags/fetchTagsAdd', params).then(res => {
            loading.value = false
            closeDrawer()
            store.dispatch('global/fetchTagsList', { tag_type: '', block: '' })
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

    const deleteTag = (tag) => {
      ElMessageBox.confirm('确认要删除此TagX吗?')
        .then(() => {
          store.dispatch('tags/fetchTagsManage', {
            op: 'del',
            tag
          }).then(res => {
            ElMessage({
              showClose: true,
              message: '删除成功！',
              type: 'success'
            })
            store.dispatch('global/fetchTagsList', { tag_type: '', block: '' })
          })
        })
        .catch(() => {})
    }

    const manageTag = (tag) => {
      ElMessageBox.confirm('确认要屏蔽此TagX吗?')
        .then(() => {
          store.dispatch('tags/fetchTagsManage', {
            block: true,
            op: 'set',
            tag
          }).then(res => {
            ElMessage({
              showClose: true,
              message: '成功！',
              type: 'success'
            })
            store.dispatch('global/fetchTagsList', { tag_type: '', block: '' })
          })
        })
        .catch(() => {})
    }

    const openDrawer = () => {
      drawer.value = true
    }
    const closeDrawer = () => {
      drawer.value = false
      resetForm()
    }
    const resetForm = () => {
      formData.tag = ''
      formData.note = ''
      if (!tagFormRef.value) return
      tagFormRef.value.resetFields()
    }
    return {
      drawer,
      formData,
      openDrawer,
      closeDrawer,
      rules,
      tagFormRef,
      addTag,
      tagsList: computed(() => store.state.global.tagsList),
      deleteTag,
      manageTag,
      loading
    }
  }
})
</script>
<style lang="scss" scoped>
.tags {
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

  .tags-content{
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
        font-weight: 400;
        color: #000000;
        line-height: 49px;
      }
    }
    .tags-table{
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
}
</style>
