import api from "./apiClient";

export const fetchCommentsForPost = (postId) => {
  if (!postId) {
    throw new Error("Post ID є обов'язковим для отримання коментарів");
  }

  return api
    .get(`/comments/post/${postId}`)
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      console.error("Помилка при завантаженні коментарів:", error);
      throw new Error("Не вдалося завантажити коментарі");
    });
};

export const createComment = (postId, text) =>
  api
    .post("/comments", { post: postId, content: text })
    .then((res) => res.data);

export const updateComment = (commentId, text) =>
  api.put(`/comments/${commentId}`, { text }).then((res) => res.data);

export const deleteComment = (commentId) =>
  api.delete(`/comments/${commentId}`).then((res) => res.data);
