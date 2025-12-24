import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/home/Home.vue'
import ArticleDetail from '../views/article/ArticleDetail.vue'
import Register from "@/views/auth/Register.vue";
import Login from "@/views/auth/Login.vue";
import Profile from "@/views/Profile/Profile.vue";
import SearchResults from "@/views/search/SearchResults.vue";
import useUserStore from "@/store/user.js";
import Notification from "@/views/Notification/Notification.vue";
import NotificationDetail from "@/views/Notification/NotificationDetail.vue";
import Editor from "@/views/Editor.vue";
import Following from "@/views/Following.vue";
import Bookmark from "@/views/Bookmark.vue";

const routes = [
    { path: '/', name: 'home',component: Home },
    { path: '/article/:id', name: 'article-detail',component: ArticleDetail },
    { path: '/register', name: 'register',component: Register },
    { path: '/login', name: 'login',component: Login },
    { path: '/profile', name: 'profile',component: Profile },
    { path: '/search', name: 'search-results',component: SearchResults },
    { path: '/notifications', name: 'notifications', component: Notification },
    { path: '/notification/:id', name: 'notification-detail', component: NotificationDetail },
    { path: '/editor', name: 'editor', component: Editor },
    { path: '/following', name: 'following', component: Following },
    { path: '/bookmarks', name: 'bookmarks', component: Bookmark }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

//白名单,后端连接完测试时，只留下前三个
const publicPages = ['/', '/login', '/register'];

router.beforeEach((to, from, next) => {
    const userStore = useUserStore()

    // 如果 Pinia 里没有 user，但 localStorage 里有 → 恢复
    if (!userStore.user) {
        const saved = localStorage.getItem("user")
        if (saved && saved !== "undefined") {
            userStore.user = JSON.parse(saved)

            userStore.fetchUserProfile(userStore.user.id)
        }
    }

    if (!userStore.isLoggedIn && !publicPages.includes(to.path)) {
        next('/login')
    } else {
        next()
    }
})

export default router
