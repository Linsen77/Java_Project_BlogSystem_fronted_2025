<template>
  <v-btn @click="toggleLike" :color="liked ? 'red' : 'grey'">
    <v-icon>{{ liked ? 'mdi-heart' : 'mdi-heart-outline' }}</v-icon>
    {{ likeCount }}
  </v-btn>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getLikeCount, likeArticle, unlikeArticle } from '@/service/like'
import useUserStore from '@/store/user'

const props = defineProps({
  articleId: {
    type: Number,
    required: true
  }
})

const userStore = useUserStore()
const likeCount = ref(0)
const liked = ref(false)

onMounted(async () => {
  // 获取初始点赞数
  likeCount.value = await getLikeCount(props.articleId)

  // 检查用户是否已经点赞
  // 这里可以从后端接口获取当前用户是否点赞
  liked.value = false
})

const toggleLike = async () => {
  if (liked.value) {
    // 取消点赞
    await unlikeArticle(props.articleId, userStore.user.id)
    liked.value = false
    likeCount.value--
  } else {
    // 点赞
    await likeArticle(props.articleId, userStore.user.id)
    liked.value = true
    likeCount.value++
  }
}
</script>
