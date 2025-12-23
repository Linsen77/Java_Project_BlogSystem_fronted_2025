<template>
  <v-container>
    <h3 class="text-h6 mb-4">推荐文章</h3>
    <v-card
        v-for="a in recommended"
        :key="a.id"
        class="mb-4 pa-4"
        elevation="0"
        variant="outlined"
        @click="$router.push(`/article/${a.id}`)"
    >
      <strong>{{ a.title }}</strong>
      <p>{{ a.author }}</p>
      <small>{{ a.date }}</small>
    </v-card>
  </v-container>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { useArticleStore } from '@/store/article'
import useUserStore from '@/store/user'

const articleStore = useArticleStore()
const userStore = useUserStore()

const recommended = computed(() => articleStore.recommended || [])

onMounted(async () => {
  if (userStore.user?.id) {
    await articleStore.fetchRecommended(userStore.user.id)
  }
})
</script>
