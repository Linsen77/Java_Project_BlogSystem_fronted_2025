import axios from "axios";

const api = axios.create({
    baseURL: "/api",
    timeout: 5000,
})

export const getArticles = () => api.get("/articles");
export const getHotArticles = (limit = 3) => api.get(`/articles/hot?limit=${limit}`);
export const getUserInfo = (id) => api.get(`/user/${id}`);
export const getUserArticles = (id) => api.get(`/user/${id}/articles`);
