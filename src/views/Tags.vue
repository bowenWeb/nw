<template>
  <div class="tags">
    <div class="tags-banner">
      <img class="banner" :src="require('@/assets/image/personal-bg.png')" alt="">
    </div>
    <div class="tags-content content-width">
      <div class="table-action">
        <div class="title">标签列表</div>
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
                  <span @click="deleteTag(scope.row.tag)">删除</span>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <el-drawer v-model="drawer"
      title="添加标签"
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

          <el-form-item label="标签" prop="tag">
            <el-input v-model="formData.tag" autocomplete="off" placeholder="请输入标签"/>
          </el-form-item>
          <el-form-item label="备注" prop="note">
          <el-input v-model="formData.note" autocomplete="off" type="textarea" rows="3"/>
          </el-form-item>
        </el-form>
      </template>
      <template #footer>
        <div class="btn-group">
          <div class="cancel-btn" @click="closeDrawer">取消</div>
          <div class="confirm-btn" type="primary" @click="addTag(tagFormRef)">确认</div>
        </div>
      </template>
    </el-drawer>
  </div>
</template>
<script>
import { defineComponent, reactive, ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { ElMessageBox, ElMessage } from 'element-plus'
import { formatDate } from '@/utils/date'
export default defineComponent({
  name: 'user-page',
  setup() {
    const store = useStore()
    onMounted(() => {
      store.dispatch('global/fetchTagsList')
    })
    const drawer = ref(false)
    const tagFormRef = ref()
    const formData = reactive({
      note: '',
      tag: ''
    })

    const rules = reactive({
      tag: { required: true, message: '请输入标签！', trigger: 'blur' }
    })
    const addTag = (formEl) => {
      if (!formEl) return
      formEl.validate((valid) => {
        if (valid) {
          const params = {
            tag: formData.tag,
            note: formData.note,
            op: 'add',
            tag_type: 0
          }
          store.dispatch('tags/fetchTagsAdd', params).then(res => {
            closeDrawer()
            store.dispatch('global/fetchTagsList')
          })
        } else {
          console.log('error submit!')
          return false
        }
      })
    }

    const deleteTag = (tag) => {
      ElMessageBox.confirm('确认要删除此账户吗?')
        .then(() => {
          store.dispatch('tags/fetchTagsDel', {
            op: 'del',
            tag
          }).then(res => {
            ElMessage({
              showClose: true,
              message: '删除成功！',
              type: 'success'
            })
            store.dispatch('global/fetchTagsList')
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
      deleteTag
    }
  }
})
</script>
<style lang="scss" scoped>
.tags {
  flex: 1;
  .tags-banner{
    margin-bottom: 20px;
    .banner{
      width: 100%;
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
    }
  }
}
</style>
