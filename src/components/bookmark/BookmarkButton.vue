<template>
  <v-btn @click="toggleBookmark" :color="isBookmarked ? 'yellow' : 'grey'">
    {{ isBookmarked ? '取消收藏' : '收藏' }}
  </v-btn>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { bookmarkArticle, unbookmarkArticle } from '@/service/bookmark'
import useUserStore from '@/store/user'

const props = defineProps({
  articleId: {
    type: Number,
    required: true
  }
})

const userStore = useUserStore()
const isBookmarked = ref(false)

onMounted(async () => {
  // 检查当前用户是否已经收藏了该文章
  isBookmarked.value = false
})

const toggleBookmark = async () => {
  if (isBookmarked.value) {
    await unbookmarkArticle(userStore.user.id, props.articleId)
    isBookmarked.value = false
  } else {
    await bookmarkArticle(userStore.user.id, props.articleId)
    isBookmarked.value = true
  }
}
</script>
