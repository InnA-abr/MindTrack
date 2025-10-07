import api from "./apiClient";

export const fetchAwards = () => api.get("/awards").then((res) => res.data);

export const fetchAwardById = (awardId) =>
  api.get(`/awards/${awardId}`).then((res) => res.data);

export const fetchAwardsByUserId = (userId) =>
  api.get(`/awards/user/${userId}`).then((res) => res.data);

export const createAward = (awardData) =>
  api.post("/awards", awardData).then((res) => res.data);

export const updateAward = (awardId, awardData) =>
  api.put(`/awards/${awardId}`, awardData).then((res) => res.data);

export const deleteAward = (awardId) =>
  api.delete(`/awards/${awardId}`).then((res) => res.data);
