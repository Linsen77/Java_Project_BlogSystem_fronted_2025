<template>
  <VContainer class="py-8">
    <!-- 顶部欢迎区 -->
    <div class="hero-banner mb-10">
      <div class="hero-overlay"></div>

      <div class="hero-content">
        <h1 class="text-h3 font-weight-bold mb-3">欢迎来到Saki_orz Blog</h1>
        <p class="text-body-1">
          ✧*｡٩(ˊᗜˋ*)و✧*｡
        </p>
      </div>
    </div>


    <!-- 搜索框 -->
    <v-text-field
        v-model="searchQuery"
        label="搜索文章（标题 / 标签 / 作者）"
        prepend-inner-icon="mdi-magnify"
        outlined
        clearable
        dense
        class="mb-8"
        @keyup.enter="handleSearch"
    />

    <VRow>
      <!-- 文章列表 -->
      <VCol cols="12" md="8">
        <VRow>
          <template v-if="filteredArticles.length > 0">
            <VCol
                cols="12"
                md="6"
                v-for="article in filteredArticles"
                :key="article.id"
            >
              <VCard class="mb-6" elevation="1">
                <VImg
                    :src="article.cover || violetImg"
                    height="160"
                    cover
                />
                <VCardTitle class="text-h6">{{ article.title }}</VCardTitle>
                <VCardText class="text-body-2">
                  {{ article.content?.slice(0, 60) + '...' }}
                </VCardText>
                <VCardActions>
                  <VBtn variant="text" color="primary" :to="`/article/${article.id}`" router>
                    阅读全文
                  </VBtn>
                </VCardActions>
              </VCard>
            </VCol>
          </template>

          <!-- 搜索为空时 -->
          <template v-else>
            <VCol cols="12" class="text-center py-10">
              <p class="text-body-1 text-secondary">没有找到相关的文章</p>
            </VCol>
          </template>
        </VRow>
      </VCol>

      <!-- 侧边栏 -->
      <VCol cols="12" md="4">

        <!-- 热门文章 -->
        <VCard class="mb-6 pa-4" elevation="0" variant="outlined">
          <h2 class="text-h6 mb-4">热门文章</h2>
          <VList density="compact">
            <VListItem
                v-for="hot in blog.hotArticles"
                :key="hot.id"
                @click="$router.push(`/post/${hot.id}`)"
                style="cursor: pointer"
            >
              <VListItemTitle>{{ hot.title }}</VListItemTitle>
            </VListItem>
          </VList>
        </VCard>

        <!-- 个性化推荐文章 -->
        <VCard class="pa-4" elevation="0" variant="outlined" v-if="recommendedArticles.length > 0">
          <h2 class="text-h6 mb-4">为你推荐</h2>
          <VList density="compact">
            <VListItem
                v-for="rec in recommendedArticles"
                :key="rec.id"
                @click="$router.push(`/post/${rec.id}`)"
                style="cursor: pointer"
            >
              <VListItemTitle>{{ rec.title }}</VListItemTitle>
            </VListItem>
          </VList>
        </VCard>
      </VCol>
    </VRow>
  </VContainer>
</template>

<script setup>
import violetImg from '@/assets/violet.jpg'
import { ref, computed, onMounted } from 'vue'
import { useBlogStore } from '@/store/blog.js'
import http from '@/service/http'
import useUserStore from '@/store/user'

const blog = useBlogStore()
const userStore = useUserStore()

// 搜索内容
const searchQuery = ref('')


const filteredArticles = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  const articles = blog.articles || []

  if (!q) return articles

  return articles.filter(article => {
    const titleMatch = article.title?.toLowerCase().includes(q)
    const authorMatch = article.author?.name?.toLowerCase().includes(q)
    const tagMatch = Array.isArray(article.tags) && article.tags.some(tag => tag.name?.toLowerCase().includes(q))

    return titleMatch || authorMatch || tagMatch
  })
})


// 推荐文章
const recommendedArticles = computed(() => blog.recommended || [])

//对接后端搜索
const handleSearch = async () => {
  const q = searchQuery.value.trim()
  if (!q) return

  try {
    // 1. 按标签搜索
    const tagRes = await http.get('/articles/search/byTag', {
      params: { tagName: q }
    })
    console.log("标签搜索结果：", tagRes)

    if (Array.isArray(tagRes) && tagRes.length > 0) {
      blog.articles = tagRes
      return
    }

    // 2. 按作者搜索
    const authorRes = await http.get('/articles/search/byAuthor', {
      params: { authorName: q }
    })
    console.log("作者搜索结果：", authorRes)

    if (Array.isArray(authorRes) && authorRes.length > 0) {
      blog.articles = authorRes
      return
    }

    // 3. 按标题搜索
    const titleRes = await http.get('/articles/search/byTitle', {
      params: { keyword: q }
    })
    console.log("标题搜索结果：", titleRes)

    blog.articles = Array.isArray(titleRes) ? titleRes : []
  } catch (err) {
    console.error("搜索失败：", err)
  }
}

// 初始化数据
onMounted(() => {
  blog.fetchArticles()
  blog.fetchHotArticles()

  //测试
  console.log("当前用户：", userStore.user)

  if (userStore.user) {
    blog.fetchRecommended(userStore.user.id)
  }
})

</script>

<style scoped>
.hero-banner {
  height: 560px;
  border-radius: 20px;
  margin-top: 40px;
  background-image: url('@/assets/banner.png');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  position: relative;
  overflow: hidden;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0.1),
      rgba(0, 0, 0, 0.35),
      rgba(0, 0, 0, 0.55)
  );
  border-radius: inherit;
}

.hero-content {
  position: absolute;
  bottom: 40px;
  left: 40px;
  z-index: 2;
  color: white;
  text-shadow: 0 3px 12px rgba(0,0,0,0.55);
}



.home-container {
  background-color: var(--background-color);
}

.v-card {
  background-color: var(--card-background);
}

.v-btn {
  background-color: var(--primary-color);
  color: white;
}

.v-btn:hover {
  background-color: var(--button-hover);
}

.v-alert {
  text-align: center;
}
</style>
