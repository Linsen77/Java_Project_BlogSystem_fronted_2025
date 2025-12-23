<template>
  <v-app>
    <!-- 顶部导航栏 -->
    <v-app-bar app color="var(--primary-color)" dark>
      <VToolbarTitle>Saki_orz Blog</VToolbarTitle>
      <v-spacer />

      <v-btn text @click="goToHome">Home</v-btn>
      <v-btn text @click="goToProfile">Profile</v-btn>
      <v-btn text @click="goToNotifications">
        <v-icon>mdi-bell</v-icon>
        <v-badge
            v-if="notificationStore.unreadCount > 0"
            color="red"
            dot
            overlap
        />
      </v-btn>

      <!-- 登录 / 注册 / 退出登录入口 -->
      <template v-if="userStore.isLoggedIn">
        <v-btn class="auth-btn" @click="logoutUser">退出登录</v-btn>
      </template>
      <template v-else>
        <v-btn class="auth-btn" @click="goToLogin">登录</v-btn>
        <v-btn class="auth-btn ml-2" @click="goToRegister">注册</v-btn>
      </template>
    </v-app-bar>

    <!-- 主体内容 -->
    <v-main>
      <router-view />
    </v-main>

    <!-- 底部版权信息 -->
    <v-footer app color="var(--primary-color)" dark>
      <v-col class="text-center">
        <span>© 2025 Saki_orz Blog Linsen77 && PROPOSEss</span>
      </v-col>
    </v-footer>
  </v-app>
</template>

<script setup>
import { useNotificationStore } from '@/store/notification'
import { useRouter } from 'vue-router'
import useUserStore from '@/store/user'

const router = useRouter()
const userStore = useUserStore()
const notificationStore = useNotificationStore()

//用户登录时开启websocket
if (userStore.user) {
  notificationStore.startSocket()
}

// 跳转到首页
const goToHome = () => {
  router.push({ name: 'home' })
}

// 跳转到个人主页
const goToProfile = () => {
  router.push({ name: 'profile' })
}

// 跳转到通知页面
const goToNotifications = () => {
  router.push({ name: 'notifications' })
}

// 跳转到登录页
const goToLogin = () => {
  router.push({ name: 'login' })
}

// 跳转到注册页
const goToRegister = () => {
  router.push({ name: 'register' })
}

// 退出登录
const logoutUser = () => {
  userStore.logout()
  router.push({ name: 'login' })
}
</script>

<style scoped>
:root {
  --primary-color: #e5d16e;
  --secondary-color: #dfdfdf;
  --accent-color: #F4C2C2;
  --background-color: #F4F4F4;
  --text-color: #333333;
}

body {
  background-color: var(--background-color);
  color: var(--text-color);
  font-family: 'Roboto', sans-serif;
}

.v-app-bar {
  background-color: var(--primary-color);
}

.v-footer {
  background-color: var(--primary-color);
}

.v-main {
  background-color: var(--background-color);
  padding: 20px;
}

.v-icon {
  color: white;
}

.auth-btn {
  background: linear-gradient(135deg, #f2b5a0, #d9a7c7);
  color: white;
  transition: transform 0.2s ease;
}
.auth-btn:hover {
  transform: translateY(-2px);
}
</style>
