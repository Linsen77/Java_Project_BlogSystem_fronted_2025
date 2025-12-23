<template>
  <v-btn @click="toggleFollow" :color="isFollowing ? 'red' : 'grey'">
    {{ isFollowing ? '取消关注' : '关注' }}
  </v-btn>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { followUser, unfollowUser } from '@/service/follow'
import useUserStore from '@/store/user'

const props = defineProps({
  followedId: {
    type: Number,
    required: true
  }
})

const userStore = useUserStore()
const isFollowing = ref(false)

onMounted(async () => {
  // 检查当前用户是否已经关注了该用户
  // 假设你已经通过 API 查询了当前用户是否关注了 followedId
  isFollowing.value = false // Mocked, replace with actual logic
})

const toggleFollow = async () => {
  if (isFollowing.value) {
    await unfollowUser(userStore.user.id, props.followedId)
    isFollowing.value = false
  } else {
    await followUser(userStore.user.id, props.followedId)
    isFollowing.value = true
  }
}
</script>
