import { defineStore} from "pinia";
import { getUserInfo } from "@/service/api.js";
import http from "@/service/http.js";

export const useProfileStore = defineStore("profile", {
    state: () =>({
        avatar: '',
        name: '',
        bio: '',
        stats: { articles: 0, following: 0, followers: 0, likes: 0 },
        articles: []
    }),
    actions:{
        async fetchUserInfo(userId){
            const res = await getUserInfo(userId);
            this.avatar = res.data.avatar;
            this.name = res.data.name;
            this.bio = res.data.bio;
            this.status = res.data.status;
        },
        async fetchUserArticles(userId){
            try {
                const res = await http.get('/articles', { params: { userId } })
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
