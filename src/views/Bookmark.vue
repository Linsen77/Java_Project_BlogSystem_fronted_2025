<template>
  <VContainer class="py-10">
    <h1 class="text-h5 mb-6">我的收藏</h1>

    <VRow>
      <VCol
          cols="12"
          md="6"
          v-for="article in bookmarkedArticles"
          :key="article.id"
      >
        <VCard class="mb-6" elevation="0" variant="outlined">
          <VImg
              :src="article.cover || 'https://picsum.photos/400/200?random'"
              height="160"
              cover
          />
          <VCardTitle class="text-h6">{{ article.title }}</VCardTitle>
          <VCardText class="text-body-2">
            {{ article.summary }}
          </VCardText>
          <VCardActions>
            <VBtn variant="text" color="primary" :to="`/article/${article.id}`">
              阅读全文
            </VBtn>
          </VCardActions>
        </VCard>
      </VCol>
    </VRow>

    <div v-if="bookmarkedArticles.length === 0" class="text-center mt-10">
      <p class="text-body-1 text-secondary">你还没有收藏任何文章</p>
    </div>
  </VContainer>
</template>

<script setup>
import {onMounted, ref} from 'vue'
import useUserStore from '@/store/user'
import { useProfileStore } from '@/store/profile'

const userStore = useUserStore()
const profileStore = useProfileStore()
const bookmarkedArticles = ref([])

onMounted(async () => {
  if (userStore.user?.id) {
    bookmarkedArticles.value = await userStore.getBookmarkArticles(userStore.user.id)
  }
})
</script>

<style scoped>
.v-card {
  background-color: var(--card-background);
  border-radius: 8px;
}
</style>
