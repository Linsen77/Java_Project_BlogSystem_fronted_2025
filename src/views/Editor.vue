<template>
  <v-container class="py-8">
    <v-card class="pa-6 glass-card">
      <v-form @submit.prevent="saveArticle">
        <!-- 标题输入 -->
        <v-text-field
            v-model="title"
            label="文章标题"
            required
            outlined
            class="mb-4"
        />

        <!-- 正文编辑区（Markdown 编辑器） -->
        <MdEditor v-model="content" height="400px" />

        <!-- 标签输入 -->
        <v-combobox
            v-model="tags"
            label="文章标签"
            multiple
            chips
            clearable
            outlined
            dense
            hint="按回车添加标签"
            persistent-hint
            class="mt-4 mb-6"
        />

        <!-- 插入封面图片 -->
        <v-file-input
            v-model="image"
            label="插入封面图片"
            accept="image/*"
            prepend-icon="mdi-image"
            class="mb-6"
        />

        <!-- 可见范围选择 -->
        <v-select
            v-model="visibility"
            :items="[
            { text: '公开', value: 'public' },
            { text: '仅粉丝和自己可见', value: 'followers' },
            { text: '仅自己可见', value: 'private' }
          ]"
            item-title="text"
            item-value="value"
            label="可见范围"
            outlined
            class="mb-6"
        />

        <!-- 发布/更新按钮 -->
        <v-btn type="submit" color="primary" :loading="loading">
          {{ isEdit ? '更新文章' : '发布文章' }}
        </v-btn>
      </v-form>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import http from '@/service/http'
import { useProfileStore } from '@/store/profile'
import useUserStore from '@/store/user'

const router = useRouter()
const route = useRoute()
const profileStore = useProfileStore()
const userStore = useUserStore()

const title = ref('')
const content = ref('')
const image = ref(null)
const visibility = ref('public')
const loading = ref(false)
const isEdit = ref(false)
const articleId = ref(null)
const tags = ref([])

onMounted(() => {
  // 编辑模式
  if (route.query.id) {
    isEdit.value = true
    articleId.value = route.query.id

    const existingArticle = profileStore.articles.find(a => a.id == articleId.value)
    if (existingArticle) {
      title.value = existingArticle.title
      content.value = existingArticle.content
      visibility.value = existingArticle.visibility || 'public'
      tags.value = existingArticle.tags || []
      image.value = null
    }
  }
})

const saveArticle = async () => {
  loading.value = true

  try {
    if (isEdit.value) {
      //编辑文章
      await http.put(`/articles/${articleId.value}`, {
        title: title.value,
        content: content.value,
        tags: tags.value.map(t => t.id),
        visibility: visibility.value
      })

      router.push(`/article/${articleId.value}`)
    } else {
      //新建文章
      const res = await http.post('/articles', {
        title: title.value,
        content: content.value,
        tags: tags.value.map(t => t.id),
        visibility: visibility.value,
        authorId: userStore.user.id
      })

      // 后端返回新文章 ID
      const newId = res.id
      router.push(`/article/${newId}`)
    }
  } catch (err) {
    console.error('文章保存失败:', err)
    alert('保存失败，请稍后再试')
  }

  loading.value = false
}
</script>

<style scoped>
.glass-card {
  background: rgba(255, 255, 255, 0.35);
  border-radius: 16px;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.4);
}
</style>
