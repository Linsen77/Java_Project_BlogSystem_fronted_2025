<template>
  <v-list>
    <v-list-item v-for="comment in comments" :key="comment.id">
      <v-list-item-content>
        <v-list-item-title>{{ comment.user.username }}</v-list-item-title>
        <v-list-item-subtitle>{{ comment.content }}</v-list-item-subtitle>
        <v-list-item-subtitle>{{ comment.createDate }}</v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
  </v-list>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getCommentsByArticle } from '@/service/comment.js'

const props = defineProps({
  articleId: {
    type: Number,
    required: true
  }
})

const comments = ref([])

onMounted(async () => {
  comments.value = await getCommentsByArticle(props.articleId)
})
</script>
