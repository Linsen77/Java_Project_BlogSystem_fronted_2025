<template>
  <v-form @submit.prevent="submitComment">
    <v-textarea v-model="content" label="发表评论" required />
    <v-btn type="submit" color="primary">提交</v-btn>
  </v-form>
</template>

<script setup>
import { ref } from 'vue'
import { addComment } from '@/service/comment'
import useUserStore from '@/store/user'

const props = defineProps({
  articleId: {
    type: Number,
    required: true
  }
})

const userStore = useUserStore()
const content = ref('')

const submitComment = async () => {
  if (!content.value) return
  await addComment(props.articleId, userStore.user.id, content.value)
  content.value = '' // 清空输入框
}
</script>
