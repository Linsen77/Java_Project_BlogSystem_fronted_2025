<template>
  <v-text-field
      v-model="query"
      label="搜索文章"
      append-icon="mdi-magnify"
      @input="onSearch"
      clearable
  />
</template>

<script setup>
import { ref } from 'vue'
import { useSearchStore } from '@/store/search'

const query = ref('')
const searchStore = useSearchStore()

const onSearch = async () => {
  if (query.value.trim() === '') {
    searchStore.setResults([])
  } else {
    // 调用搜索API进行搜索
    await searchStore.search(query.value)
  }
}
</script>
e>