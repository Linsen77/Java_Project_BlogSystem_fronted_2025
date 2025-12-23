import { defineStore} from "pinia";
import { getUserInfo, getUserArticles} from "@/service/api.js";

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
            const res = await getUserArticles(userId);
            this.articles = res.data;
        }
    }
})
