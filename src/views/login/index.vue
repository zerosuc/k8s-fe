<template>
  <div class="login-container">
    <el-card class="login-card" shadow="hover">
      <h2 class="login-title">中星微云管平台</h2>
      <el-form :model="loginForm" :rules="rules" ref="loginFormRef" label-width="0">
        <!-- <el-form-item label="用户名" prop="username"> -->
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" placeholder="Username">
            <template #prefix>
              <el-icon><User /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" type="password" placeholder="Password">
            <template #prefix>
              <el-icon><Lock /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="login-button" @click="handleLogin">登录</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- 版权说明 -->
    <div class="copyright">© 2024 Your Company. All rights reserved.</div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
// import { router } from  'vue-router'
import router from '@/router/index'
import { ElMessage } from 'element-plus'
import { User, Lock } from '@element-plus/icons-vue'

// 定义带有默认值的表单对象
const loginForm = reactive({
  username: 'admin',
  password: '123456'
})

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 15, message: '用户名长度在 3 到 15 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' }
  ]
}

const loginFormRef = ref(null)

const handleLogin = () => {
  loginFormRef.value.validate((valid) => {
    if (valid) {
      ElMessage({
        message: '登录成功',
        type: 'success'
      })
      localStorage.setItem('username', loginForm.username)
      router.push('/home')
      // 执行登录操作
    } else {
      ElMessage({
        message: '请正确填写表单',
        type: 'error'
      })
      return false
    }
  })
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100vh;
}
/* .el-input {
    width: 150px;
  } */

.login-card {
  width: 400px;
  padding: 40px 20px;
  border-radius: 8px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  background: #ffffff;
}

.login-title {
  text-align: center;
  margin-bottom: 30px;
  font-size: 24px;
  color: #333;
}

.login-button {
  width: 100%;
  height: 40px;
  font-size: 16px;
}

/* 版权说明样式 */
/* 样式类名应与模板中一致 */
.copyright {
  text-align: center;
  margin-top: 20px;
  color: #888;
  font-size: 12px;
}
</style>
