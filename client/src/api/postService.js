import api from "./apiClient";

export const fetchPosts = () => api.get("/posts").then((res) => res.data);

export const fetchPostById = (postId) =>
  api.get(`/posts/${postId}`).then((res) => res.data);

export const createPost = (postData) =>
  api.post("/posts", postData).then((res) => res.data);

export const updatePost = (postId, postData) =>
  api.put(`/posts/${postId}`, postData).then((res) => res.data);

export const deletePost = (postId) =>
  api.delete(`/posts/${postId}`).then((res) => res.data);

export const fetchPostsByUser = (userId) =>
  api.get(`/posts/user/${userId}`).then((res) => res.data);
