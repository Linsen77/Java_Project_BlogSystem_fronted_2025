<template>
  <v-container
      fluid
      class="d-flex justify-center align-center"
      style="min-height: 100vh; background: linear-gradient(135deg, #f5e6d3, #f2d7d5, #e8dcd0);"
  >
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card class="pa-6 glass-card" elevation="8">
          <v-form @submit.prevent="loginUser">
            <v-card-title class="text-h5 font-weight-bold text-center mb-6">
              欢迎登录
            </v-card-title>

            <v-text-field
                v-model="email"
                label="邮箱"
                prepend-inner-icon="mdi-email"
                required
                outlined
                dense
                class="mb-4"
            />

            <v-text-field
                v-model="password"
                type="password"
                label="密码"
                prepend-inner-icon="mdi-lock"
                required
                outlined
                dense
                class="mb-6"
            />

            <v-btn
                type="submit"
                color="primary"
                class="w-100 mb-4"
                :loading="loading"
                rounded
            >
              登录
            </v-btn>

            <!-- 切换到注册页面 -->
            <v-btn
                class="w-100 same-style-btn"
                @click="router.push('/register')"
            >
              没有账号？去注册
            </v-btn>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import http from '@/service/http'
import useUserStore from '@/store/user'

const router = useRouter()
const userStore = useUserStore()

const email = ref('')
const password = ref('')
const loading = ref(false)

const loginUser = async () => {
  try {
    loading.value = true

    const res = await http.post('/auth/login', {
      email: email.value,
      password: password.value
    })

    //测试登录
    console.log("登录返回：", res)
    console.log("跳转条件是否成立：", res.code === 200)

    if (res.code === 200) {
      // 保存用户信息
      userStore.setUser(res.data)

      //测试登录
      console.log("准备跳转到 profile")
      // 跳转
      router.push('/profile')
    } else {
      alert(res.msg)
    }

  } catch (error) {
    console.error('登录失败:', error)
    alert('登录失败，请检查用户名或密码')
  } finally {
    loading.value = false
  }
}

</script>


<style scoped>
.glass-card {
  background: rgba(255, 255, 255, 0.35);
  border-radius: 16px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.4);
}

.v-btn {
  background: linear-gradient(135deg, #f2b5a0, #d9a7c7);
  color: white;
  transition: transform 0.2s ease;
}

.v-btn:hover {
  transform: translateY(-2px);
}
</style>
