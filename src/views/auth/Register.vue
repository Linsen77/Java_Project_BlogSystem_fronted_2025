<template>
  <v-container
      fluid
      class="d-flex justify-center align-center"
      style="min-height: 100vh; background: linear-gradient(135deg, #f5e6d3, #f2d7d5, #e8dcd0);"
  >
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card class="pa-6 glass-card" elevation="8">
          <v-form @submit.prevent="registerUser">
            <v-card-title class="text-h5 font-weight-bold text-center mb-6">
              欢迎注册
            </v-card-title>

            <!-- 用户名 -->
            <v-text-field
                v-model="username"
                label="用户名"
                prepend-inner-icon="mdi-account"
                required
                outlined
                dense
                class="mb-4"
            />

            <!-- 邮箱 -->
            <v-text-field
                v-model="email"
                label="邮箱"
                prepend-inner-icon="mdi-email"
                required
                outlined
                dense
                class="mb-4"
            />

            <!-- 验证码 + 发送按钮 -->
            <v-row class="mb-4">
              <v-col cols="7">
                <v-text-field
                    v-model="code"
                    label="验证码"
                    prepend-inner-icon="mdi-shield-key"
                    required
                    outlined
                    dense
                />
              </v-col>

              <v-col cols="5" class="d-flex align-center">
                <v-btn
                    color="primary"
                    block
                    :disabled="countdown > 0"
                    @click="sendCode"
                >
                  {{ countdown > 0 ? `${countdown}s` : '发送验证码' }}
                </v-btn>
              </v-col>
            </v-row>

            <!-- 密码 -->
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

            <!-- 注册按钮 -->
            <v-btn
                type="submit"
                color="primary"
                class="w-100 mb-4"
                rounded
                :loading="loading"
            >
              注册
            </v-btn>

            <!-- 切换到登录页面 -->
            <v-btn
                class="w-100 same-style-btn"
                @click="router.push('/login')"
            >
              已有账号？去登录
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

const username = ref('')
const email = ref('')
const password = ref('')
const code = ref('')

const loading = ref(false)
const countdown = ref(0)
let timer = null

// 发送验证码
const sendCode = async () => {
  if (!email.value) {
    alert('请输入邮箱')
    return
  }
  try {
    await http.get(`/auth/sendCode/${email.value}`)

    countdown.value = 60
    timer = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) clearInterval(timer)
    }, 1000)

    alert('验证码已发送，请检查邮箱')
  } catch (error) {
    console.error('验证码发送失败:', error)
    alert('发送失败，请稍后再试')
  }
}

// 注册
const registerUser = async () => {
  try {
    loading.value = true

    const res = await http.post('/auth/register', {
      name: username.value,
      email: email.value,
      password: password.value,
      code: code.value
    })

    if (res.code === 200) {
      alert('注册成功，请登录')
      router.push('/login')
    } else {
      alert(res.msg)
    }
  } catch (error) {
    console.error('注册失败:', error)
    alert('注册失败，请检查验证码或稍后再试')
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
