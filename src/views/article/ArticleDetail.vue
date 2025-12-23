<template>
  <v-container class="py-10">
    <!-- 封面图 -->
    <v-img
        v-if="article?.cover"
        :src="article.cover"
        max-height="300"
        class="mb-6"
        cover
    />

    <!-- 标题区 -->
    <v-card class="pa-6 mb-8" elevation="0" variant="tonal" color="primary">
      <h1 class="text-h4 font-weight-medium mb-2">{{ article?.title }}</h1>
      <p class="text-body-2 text-secondary">
        作者：{{ article?.author || '默认用户' }} · 发布于 {{ article?.date || '2026-01-01' }}
      </p>
    </v-card>

    <!-- 查看作者主页 -->
    <v-btn color="primary" class="mt-4" @click="goToAuthorProfile">
      查看作者主页
    </v-btn>

    <!-- 正文区 -->
    <v-card class="pa-6 mb-10" elevation="0" variant="outlined">
      <v-md-preview v-if="article" :text="article.content" />
      <div v-else class="text-error">文章未找到</div>
    </v-card>

    <!-- 点赞 + 评论 + 分享 -->
    <v-row class="mb-10">
      <v-col cols="12" md="6" class="d-flex align-center">

        <!-- 点赞按钮 -->
        <v-btn
            variant="text"
            color="primary"
            :class="{ 'like-animate': isLiked }"
            :prepend-icon="isLiked ? 'mdi-thumb-up' : 'mdi-thumb-up-outline'"
            @click="toggleLike"
        >
          {{ likes }}
        </v-btn>

        <!-- 评论按钮（滚动到评论区） -->
        <v-btn
            variant="text"
            color="primary"
            prepend-icon="mdi-comment"
            @click="scrollToComments"
        >
          评论
        </v-btn>

        <v-btn
            v-if="article"
            variant="text"
            color="primary"
            prepend-icon="mdi-heart"
            @click="toggleBookmark"
        >
          {{ userStore.isBookmarked(article.id) ? '取消收藏' : '收藏' }}
        </v-btn>


        <v-btn
            variant="text"
            color="secondary"
            prepend-icon="mdi-pencil"
            @click="editArticle"
        >
          编辑
        </v-btn>

        <v-btn
            v-if="userStore.user?.id === article?.authorId"
            variant="text"
            color="error"
            prepend-icon="mdi-delete"
            @click="dialog = true"
        >
          删除
        </v-btn>
      </v-col>
    </v-row>

    <!-- 评论区 -->
    <div ref="commentSection">
      <h3 class="text-h6 mb-4">评论</h3>

      <!-- 评论列表 -->
      <v-card
          v-for="c in comments"
          :key="c.id"
          class="mb-4 pa-4"
          elevation="0"
          variant="outlined"
      >
        <strong>{{ c.authorName }}</strong>
        <p>{{ c.content }}</p>
        <small>{{ c.date }}</small>
        <v-btn
            v-if="userStore.user?.id === c.authorId || userStore.user?.id === article.authorId"
            variant="text"
            color="error"
            size="small"
            @click="deleteComment(c.id)"
        >
          删除
        </v-btn>
      </v-card>

      <!-- 发布评论 -->
      <v-text-field
          v-model="newComment"
          label="写下你的评论..."
          outlined
          class="mt-4"
      />

      <v-btn color="secondary" class="mt-2" @click="submitComment">
        发布评论
      </v-btn>
    </div>

    <!-- 删除确认弹窗 -->
    <v-dialog v-model="dialog" max-width="400">
      <v-card>
        <v-card-title class="text-h6">确认删除</v-card-title>
        <v-card-text>你确定要删除这篇文章吗？此操作不可恢复。</v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" color="secondary" @click="dialog = false">取消</v-btn>
          <v-btn variant="text" color="error" @click="deleteArticle">确认删除</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProfileStore } from '@/store/profile'
import { useArticleStore } from '@/store/article'
import useUserStore from '@/store/user'
import {connectWebSocket} from "@/service/notificationSocket.js";

const route = useRoute()
const router = useRouter()
const profileStore = useProfileStore()
const articleStore = useArticleStore()
const userStore = useUserStore()
const isLiked = computed(() => userStore.isLiked(articleId))
const article = ref(null)
const dialog = ref(false)
const newComment = ref('')
const commentSection = ref(null)

const articleId = route.params.id

// 点赞数
const likes = computed(() => articleStore.likes[articleId] || 0)

// 评论列表
const comments = computed(() => articleStore.comments[articleId] || [])

// 页面加载
onMounted(async () => {
  article.value = profileStore.articles.find(a => a.id == articleId)
  userStore.addHistory(article.id)

  await articleStore.fetchLikes(articleId)
  await articleStore.fetchComments(articleId)


  //建立 WebSocket 连接，监听点赞和评论更新
  if (userId) connectWebSocket((msg) => {
    if (msg.type === 'article_like_update' && msg.articleId == articleId) {
      articleStore.applyLikeUpdate(articleId, msg.newCount)
    }

    if (msg.type === 'article_comment_update' && msg.articleId == articleId) {
      articleStore.applyCommentUpdate(articleId, msg.comment)
    }
  })
})

// 跳转作者主页
const goToAuthorProfile = () => {
  router.push(`/profile?userId=${article.value.authorId}`)
}

// 点赞 / 取消点赞
const toggleLike = async () => {
  if (!userStore.isLoggedIn) return alert('请先登录')

  if (isLiked.value) {
    await articleStore.unlike(articleId)
    userStore.removeLike(articleId)
  } else {
    await articleStore.like(articleId)
    userStore.addLike(articleId)
  }
}

// 发布评论
const submitComment = async () => {
  if (!userStore.isLoggedIn) return alert('请先登录')
  if (!newComment.value.trim()) return

  await articleStore.addComment(articleId, newComment.value)
  newComment.value = ''
}

// 滚动到评论区
const scrollToComments = () => {
  commentSection.value?.scrollIntoView({ behavior: 'smooth' })
}

// 编辑文章
const editArticle = () => {
  router.push({ name: 'editor', query: { id: article.value.id } })
}

const deleteArticle = async () => {
  if (!article.value) return

  //前端权限校验
  if (userStore.user.id !== article.value.authorId) {
    alert('你没有权限删除这篇文章')
    return
  }

  try {
    await articleStore.deleteArticle(article.value.id)
    profileStore.articles = profileStore.articles.filter(a => a.id != article.value.id)
    dialog.value = false
    router.push('/profile')
  } catch (err) {
    console.error('删除失败:', err)
    alert('删除失败，请稍后再试')
  }
}

//收藏文章
const toggleBookmark = () => {
  if (!userStore.isLoggedIn) return alert('请先登录')

  if (userStore.isBookmarked(article.value.id)) {
    userStore.removeBookmark(article.value.id)
  } else {
    userStore.addBookmark(article.value.id)
  }
}

//删除评论
const deleteComment = async (commentId) => {
  if (!userStore.isLoggedIn) return alert('请先登录')

  // 权限：评论作者 或 文章作者
  const comment = comments.value.find(c => c.id === commentId)
  if (!comment) return

  if (
      userStore.user.id !== comment.authorId &&
      userStore.user.id !== article.value.authorId
  ) {
    alert('你没有权限删除这条评论')
    return
  }

  try {
    await articleStore.deleteComment(articleId, commentId)
  } catch (err) {
    console.error('删除评论失败:', err)
    alert('删除失败，请稍后再试')
  }
}

</script>

<style scoped>
.v-card {
  background-color: var(--card-background);
  border-radius: 12px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
}
.v-btn {
  background-color: var(--primary-color);
  color: white;
}
.v-btn:hover {
  background-color: var(--button-hover);
}
.like-animate {
  animation: like-bounce 0.3s ease;
}

@keyframes like-bounce {
  0% { transform: scale(1); }
  50% { transform: scale(1.3); }
  100% { transform: scale(1); }
}

</style>
