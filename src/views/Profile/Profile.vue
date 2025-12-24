<template>
  <div v-if="userStore.user">
    <VContainer class="py-10">
      <!-- 用户信息区 -->
      <VCard class="pa-6 mb-10" elevation="0" variant="tonal" color="primary">
        <VRow align="center">
          <!-- 头像 -->
          <VCol cols="12" md="3" class="d-flex justify-center mb-4 mb-md-0">
            <VAvatar size="120">
              <VImg :src="profileUser.avatarUrl || defaultAvatar" alt="用户头像" />
            </VAvatar>
          </VCol>

          <!-- 用户信息 -->
          <VCol cols="12" md="9">
            <h1 class="text-h5 font-weight-medium mb-2">
              {{ profileUser?.name || '未知用户' }}
            </h1>

            <p class="text-body-1 text-secondary mb-6">
              {{ profileUser.bio || '这个用户很神秘，还没有简介~' }}
            </p>

            <!-- 数据统计 -->
            <VRow>
              <VCol cols="2" class="text-center">
                <div class="text-h6">{{ userArticles.length }}</div>
                <div class="text-caption">文章</div>
              </VCol>

              <VCol cols="2" class="text-center" style="cursor: pointer;" @click="goToFollowing">
                <div class="text-h6">{{ stats?.following ?? 0 }}</div>
                <div class="text-caption">关注</div>
              </VCol>

              <VCol cols="2" class="text-center">
                <div class="text-h6">{{ stats?.followers ?? 0}}</div>
                <div class="text-caption">粉丝</div>
              </VCol>

              <VCol cols="2" class="text-center">
                <div class="text-h6">{{ stats?.likes ?? 0 }}</div>
                <div class="text-caption">获赞</div>
              </VCol>

              <!-- 收藏数（仅自己可见） -->
              <VCol cols="2" class="text-center" v-if="isSelf">
                <div style="cursor: pointer;" @click="goToBookmarks">
                  <div class="text-h6">{{ stats.bookmarks }}</div>
                  <div class="text-caption">收藏</div>
                </div>
              </VCol>
            </VRow>

            <!-- 当前用户访问自己的主页 -->
            <template v-if="isSelf">
              <VBtn color="secondary" class="mt-6" @click="$router.push('/editor')">
                <v-icon left>mdi-pencil</v-icon>
                写文章
              </VBtn>

              <VBtn color="primary" class="mt-6 ml-4" @click="dialog = true">
                <v-icon left>mdi-account-edit</v-icon>
                编辑资料
              </VBtn>
            </template>

            <!-- 访问别人主页：关注/取消关注 -->
            <template v-else>
              <VBtn
                  v-if="userStore.user && !isFollowingUser"
                  color="secondary"
                  class="mt-6"
                  @click="followUser"
              >
                <v-icon left>mdi-account-plus</v-icon>
                关注
              </VBtn>

              <VBtn
                  v-else
                  color="primary"
                  class="mt-6"
                  @click="unfollowUser"
              >
                <v-icon left>mdi-account-minus</v-icon>
                取消关注
              </VBtn>
            </template>
          </VCol>
        </VRow>
      </VCard>

      <!-- 用户文章列表 -->
      <h2 class="text-h6 mb-6">TA 的文章</h2>
      <VRow>
        <VCol cols="12" md="6" v-for="article in userArticles" :key="article.id">
          <VCard class="mb-6" elevation="0" variant="outlined">
            <VImg
                :src="article.cover"
                height="160"
                cover
            />
            <VCardTitle class="text-h6">{{ article.title }}</VCardTitle>
            <VCardText class="text-body-2">
              {{ article.summary }}
            </VCardText>
            <VCardActions>
              <VBtn variant="text" color="primary" :to="`/article/${article.id}`" router>
                阅读全文
              </VBtn>
            </VCardActions>
          </VCard>
        </VCol>
      </VRow>

      <!-- 收藏文章列表（仅自己可见） -->
      <template v-if="isSelf">

        <VRow>
          <VCol cols="12" md="6" v-for="article in bookmarkedArticles" :key="article.id">
            <VCard class="mb-6" elevation="0" variant="outlined">
              <VImg
                  :src="article.cover"
                  height="160"
                  cover
              />
              <VCardTitle class="text-h6">{{ article.title }}</VCardTitle>
              <VCardText class="text-body-2">
                {{ article.summary }}
              </VCardText>
              <VCardActions>
                <VBtn variant="text" color="primary" :to="`/article/${article.id}`" router>
                  阅读全文
                </VBtn>
              </VCardActions>
            </VCard>
          </VCol>
        </VRow>
      </template>

      <!-- 编辑用户信息弹窗 -->
      <VDialog v-model="dialog" max-width="500" v-if="isSelf">
        <VCard>
          <VCardTitle class="text-h6">编辑个人资料</VCardTitle>
          <VCardText>
            <VForm @submit.prevent="saveProfile">
              <VTextField v-model="editName" label="用户名" outlined class="mb-4" />
              <VTextField v-model="editBio" label="简介" outlined class="mb-4" />
              <VFileInput
                  v-model="editAvatar"
                  label="上传头像"
                  accept="image/*"
                  prepend-icon="mdi-image"
                  class="mb-4"
              />
            </VForm>
          </VCardText>
          <VCardActions>
            <VSpacer />
            <VBtn variant="text" color="secondary" @click="dialog = false">取消</VBtn>
            <VBtn variant="text" color="primary" @click="saveProfile">保存</VBtn>
          </VCardActions>
        </VCard>
      </VDialog>
    </VContainer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useProfileStore } from '@/store/profile.js'
import useUserStore from '@/store/user.js'
import { useRoute, useRouter } from 'vue-router'
import http from '@/service/http'
import defaultAvatar from '@/assets/default-avatar.png'
import { useArticleStore } from '@/store/article'

const router = useRouter()
const profileStore = useProfileStore()
const userStore = useUserStore()
const route = useRoute()
const otherUser = ref(null)
const isFollowingUser = ref(false)
const bookmarkIds = ref([])
const articleStore = useArticleStore()


// 当前查看的用户 ID
const profileUserId = computed(() => {
  if (!userStore.user) return null
  return route.query.userId ? Number(route.query.userId) : userStore.user.id
})

// 是否是本人主页
const isSelf = computed(() => {
  return userStore.user && profileUserId.value === userStore.user.id
})

// 当前展示的用户信息
const profileUser = computed(() => {
  if (!profileUserId.value) return null
  if (isSelf.value) return userStore.user
  if (otherUser.value) {
    return{
      id: otherUser.value.id,
      name: otherUser.value.username,
      avatarUrl: otherUser.value.avatar,
      bio: otherUser.value.bio
    }
  }

  return {
    id: profileUserId.value,
    name: `用户 ${profileUserId.value}`,
    avatarUrl: defaultAvatar,
    bio: '这个用户很神秘，还没有简介~'
  }
})

// 用户统计数据
const stats = ref({
  articles: 0,
  followers: 0, //我的粉丝
  following: 0, //我关注的人
  likes: 0
})

// 编辑资料弹窗
const dialog = ref(false)
const editName = ref('')
const editBio = ref('')
const editAvatar = ref(null)


onMounted(async () => {

  await profileStore.fetchUserArticles(profileUserId.value)

  //加载统计数据
  if (profileUserId.value) {
    try {
      if (userStore.isLoggedIn && userStore.user) {
        const data = await userStore.fetchUserStatistics(profileUserId.value)
        stats.value = {
          articles: data.articleCount,
          followers: data.followerCount,   // 粉丝
          following: data.followeeCount,   // 我关注的人
          likes: data.likeCount,
          bookmarks: data.bookmarks
        }

      }
    } catch (error) {
      console.error('获取用户统计失败:', error)
    }
  }

  //如果访问别人主页，加载真实资料
  if (!isSelf.value) {
    try {
      const res = await http.get(`/users/${profileUserId.value}`, {
        params: { viewerId: userStore.user?.id }
      })

      //测试用
      console.log("后端返回的用户数据 =", res)

      otherUser.value = res // 后端返回的真实用户信息
    } catch (e) {
      console.error("加载用户资料失败", e)
    }
  }

  //本人主页
  if (isSelf.value) {
    editName.value = userStore.user?.name
    editBio.value = userStore.user?.bio

    try{
      const res = await http.get(`/users/bookmarks/${userStore.user.id}`)
      bookmarkIds.value = Array.isArray(res) ? res.map(a => a.id) : []
    } catch (e){
      console.error("收藏加载失败",e)
      bookmarkIds.value = []
    }
  }

  // 检查是否已关注
  if (!isSelf.value && userStore.user) {
    try {
      const res = await http.get('/follow/isFollowing', {
        params: {
          viewerId: userStore.user.id,      // 当前登录用户
          authorId: profileUserId.value     // 被查看的用户
        }
      })
      isFollowingUser.value = res === true
    } catch (e) {
      console.error("检查关注状态失败", e)
    }
  }

})

// 保存个人资料
const saveProfile = async () => {
  try {
    const formData = new FormData()
    formData.append("name", editName.value)
    formData.append("bio", editBio.value)

    console.log(editAvatar.value)

    // editAvatar.value 是 File 对象
    if (editAvatar.value) {
      formData.append("avatar", editAvatar.value)
    }

    const updatedUser = await http.put(`/users/${userStore.user.id}`, formData)
    userStore.user = updatedUser
    const fullAvatarUrl = updatedUser.avatarUrl.startsWith("http")
        ? updatedUser.avatarUrl
        : "http://localhost:8080" + updatedUser.avatarUrl
    userStore.user.avatarUrl = fullAvatarUrl
    console.log("userStore.user.avatarUrl =", userStore.user.avatarUrl)
    console.log(updatedUser.avatarUrl)


    dialog.value = false
  } catch (e) {
    console.error("更新资料失败", e)
  }
}


// 当前用户的文章
const userArticles = computed(() => {
  const list = Array.isArray(profileStore.articles) ? profileStore.articles : []
  return list.filter(a => a.author?.id == profileUserId.value)
})


// 收藏文章
const bookmarkedArticles = computed(() => {
  const list = Array.isArray(profileStore.articles) ? profileStore.articles : []
  return list.filter(a => articleStore.bookmarks[a.id])
})


// 关注 / 取消关注
const followUser = async () => {
  await userStore.follow(profileUserId.value)
  isFollowingUser.value = true
}

const unfollowUser = async () => {
  await userStore.unfollow(profileUserId.value)
  isFollowingUser.value = false
}


// 查看关注列表
const goToFollowing = () => {
  router.push(`/following?userId=${profileUserId.value}`)
}

// 查看收藏列表（独立页面）
const goToBookmarks = () => {
  router.push('/bookmarks')
}
</script>

<style scoped>
.v-card {
  background-color: var(--card-background);
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}
.v-card-title {
  color: var(--primary-color);
}
.v-btn {
  background-color: var(--primary-color);
  color: white;
}
.v-btn:hover {
  background-color: var(--button-hover);
}
</style>