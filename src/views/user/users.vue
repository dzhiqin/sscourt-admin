<template>
  <div class="users">
    <el-card v-loading="loading" shadow="never">
      <div class="toolbar-wrapper">
        <div>
          <el-button type="primary" :icon="CirclePlus" @click="dialogVisible = true">新增用户</el-button>
        </div>
        <div>
          <el-tooltip content="刷新当前页">
            <el-button type="primary" :icon="RefreshRight" circle @click="getUserData" />
          </el-tooltip>
        </div>
      </div>
      <div class="table-wrapper">
        <el-table :data="userData">
          <el-table-column prop="avatar" label="头像" align="center" />
          <el-table-column prop="username" label="用户名" align="center" />
          <el-table-column prop="password" label="密码" align="center" />
          <el-table-column prop="createTime" label="创建时间" align="center" />
          <el-table-column prop="createUser" label="创建人" align="center" />
          <el-table-column prop="state" label="状态" align="center">
            <template #default="scope">
              <el-tag v-if="scope.row.state === 1" type="success" effect="plain">启用</el-tag>
              <el-tag v-if="scope.row.state === 2" type="danger" effect="plain">禁用</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="isDelete" label="是否删除" align="center">
            <template #default="scope">
              <el-tag v-if="scope.row.isDelete === 0" type="success" effect="plain">使用中</el-tag>
              <el-tag v-if="scope.row.isDelete === 1" type="danger" effect="plain">已删除</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="updateTime" label="更新日期" align="center" />
          <el-table-column prop="updateUser" label="更新人" align="center" />
        </el-table>
      </div>
      <div class="pager-wrapper">
        <el-pagination
          background
          :layout="paginationData.layout"
          :page-sizes="paginationData.pageSizes"
          :total="paginationData.total"
          :page-size="paginationData.pageSize"
          :currentPage="paginationData.currentPage"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
    <el-dialog
      v-model="dialogVisible"
      :title="formData.id === undefined ? '新增用户' : '修改用户'"
      @closed="resetForm"
      width="30%"
    >
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px" label-position="left">
        <el-form-item prop="username" label="用户名">
          <el-input v-model="formData.username" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="password" label="密码" v-if="formData.id === undefined">
          <el-input v-model="formData.password" placeholder="请输入" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleCreateOrUpdate" :loading="loading">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>
<script setup>
import { ref, watch } from "vue"
import { CirclePlus, RefreshRight } from "@element-plus/icons-vue"
import { usePagination } from "@/hooks/usePagination"
import { getUsersByPage, userCreate } from "@/api/login"
import { ElMessage } from "element-plus"
defineOptions({
  name: "Users"
})
const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()
const dialogVisible = ref(false)
const loading = ref(false)
const formRef = ref(null)
const formData = ref({
  id: undefined,
  username: "",
  password: ""
})
const formRules = {
  username: [{ required: true, trigger: "blur", message: "请输入用户名" }],
  password: [{ required: true, trigger: "blur", message: "请输入密码" }]
}
const userData = ref([])
const handleCreateOrUpdate = () => {
  formRef.value?.validate((valid, fields) => {
    if (!valid) return console.error("表单校验不通过", fields)
    loading.value = true
    // const api = formData.value.id === undefined ? createTableDataApi : updateTableDataApi

    userCreate(formData.value)
      .then(() => {
        ElMessage.success("操作成功")
        dialogVisible.value = false
        getUserData()
      })
      .finally(() => {
        loading.value = false
      })
  })
}
const getUserData = () => {
  loading.value = true
  getUsersByPage({ pageNum: paginationData.currentPage, pageSize: paginationData.pageSize })
    .then((res) => {
      userData.value = res.data.records
      paginationData.total = res.data.total
    })
    .catch(() => {
      userData.value = []
    })
    .finally(() => {
      loading.value = false
    })
}
const resetForm = () => {
  formRef.value?.clearValidate()
  formData.value = {
    id: undefined,
    username: "",
    password: ""
  }
}
watch([() => paginationData.currentPage, () => paginationData.pageSize], getUserData, { immediate: true })
</script>
<style lang="scss" scoped>
.toolbar-wrapper {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}
.pager-wrapper {
  display: flex;
  justify-content: flex-end;
}
</style>
