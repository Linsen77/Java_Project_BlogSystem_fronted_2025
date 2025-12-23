<template>
  <v-list>
    <v-list-item v-for="article in searchResults" :key="article.id" @click="goToArticle(article.id)">
      <v-list-item-content>
        <v-list-item-title>{{ article.title }}</v-list-item-title>
        <v-list-item-subtitle>{{ article.author.username }}</v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
  </v-list>
  <v-list-item v-if="searchResults.length === 0">
    <v-list-item-content>
      <v-list-item-title>No articles found</v-list-item-title>
    </v-list-item-content>
  </v-list-item>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useSearchStore } from '@/store/search'
import { useRouter } from 'vue-router'

const searchResults = ref([])
const searchStore = useSearchStore()
const router = useRouter()

watch(() => searchStore.results, (newResults) => {
  searchResults.value = newResults
})

const goToArticle = (id) => {
  router.push(`/article/${id}`)
}
</script>
