<template>
  <VContainer class="py-10">
    <h1 class="text-h5 mb-6">关注列表</h1>

    <VRow>
      <VCol
          cols="12"
          md="6"
          v-for="user in followingUsers"
          :key="user.id"
      >
        <VCard class="pa-4 mb-4" elevation="0" variant="outlined">
          <VRow align="center">
            <VCol cols="3">
              <VAvatar size="70">
                <VImg :src="user.avatarUrl" />
              </VAvatar>
            </VCol>

            <VCol cols="9">
              <h3 class="text-h6">{{ user.username }}</h3>
              <p class="text-body-2">{{ user.bio }}</p>

              <VBtn
                  variant="text"
                  color="primary"
                  @click="$router.push(`/profile?userId=${user.id}`)"
              >
                查看主页
              </VBtn>

              <!-- 当前用户可取消关注 -->
              <VBtn
                  v-if="isSelf"
                  variant="text"
                  color="red"
                  @click="unfollow(user.id)"
              >
                取消关注
              </VBtn>
            </VCol>
          </VRow>
        </VCard>
      </VCol>
    </VRow>
  </VContainer>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import useUserStore from '@/store/user'
import { useRoute } from 'vue-router'

const userStore = useUserStore()
const route = useRoute()

// 当前查看的用户 ID
const profileUserId = computed(() => route.query.userId || userStore.user?.id)

// 是否是本人
const isSelf = computed(() => profileUserId.value == userStore.user?.id)

const followingUsers = ref([])

onMounted(async () => {
  followingUsers.value = await userStore.getFollowingUsers(profileUserId.value)
})

// 取消关注
const unfollow = (id) => {
  userStore.unfollow(id)
  followingUsers.value = followingUsers.value.filter(u => u.id !== id)
}
</script>

<style scoped>
.v-card {
  background-color: var(--card-background);
}
</style>
