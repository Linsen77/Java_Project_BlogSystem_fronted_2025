import { defineStore} from "pinia";
import { getUserInfo } from "@/service/api.js";
import http from "@/service/http.js";

export const useProfileStore = defineStore("profile", {
    state: () =>({
        avatar: '',
        name: '',
        bio: '',
        stats: { articleCount: 0, followerCount: 0, followeeCount: 0, likeCount: 0, bookmarks: 0 },
        articles: [],
    }),
    actions:{
        async fetchUserInfo(userId){
            const res = await getUserInfo(userId);
            this.avatar = res.data.avatar;
            this.name = res.data.name;
            this.bio = res.data.bio;
        },

        // 获取用户统计数据（文章数、粉丝数、关注数、点赞数、收藏数）
        async fetchUserStats(userId) {
            const res = await http.get(`/users/${userId}/status`);
            this.stats = res; // 后端返回的字段名和 stats 完全一致
        },

        async fetchUserArticles(userId){
            try {
                const res = await http.get(`/articles/byAuthor/${userId}`)
                // 如果后端返回的是数组
                this.articles = Array.isArray(res) ? res : []
                console.log("文章列表返回 =", this.articles)
            } catch (e) {
                console.error("获取用户文章失败", e)
                this.articles = []
            }
        }

    }
})
