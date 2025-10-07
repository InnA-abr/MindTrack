import api from "./apiClient";

export const followUser = (userId) =>
  api.post(`/followers/follow/${userId}`).then((res) => res.data);

export const unfollowUser = (userId) =>
  api.post(`/followers/unfollow/${userId}`).then((res) => res.data);

export const getFollowers = (userId) =>
  api.get(`/followers/followers/${userId}`).then((res) => res.data);

export const getFollowing = (userId) =>
  api.get(`/followers/following/${userId}`).then((res) => res.data);
