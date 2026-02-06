import axios from "axios";
import { SOCIAL_SERVICE_BASE_URL } from "../utils/url";

const BASE_URL = `${SOCIAL_SERVICE_BASE_URL}/api/social`;

export interface Like {
  id: number;
  postId: number;
  username: string;
  createdAt: string; // ISO-8601 string from backend
}

// Like a post
export const likePost = async (postId: number, username: string): Promise<Like> => {
  const res = await axios.post(`${BASE_URL}/like/${postId}/${username}`);
  return res.data;
};

// Unlike a post
export const unlikePost = async (postId: number, username: string): Promise<void> => {
  await axios.delete(`${BASE_URL}/like/${postId}/${username}`);
};

// Get likes for a post
export const getLikesForPost = async (postId: number): Promise<Like[]> => {
  const res = await axios.get(`${BASE_URL}/likes/post/${postId}`);
  return res.data;
};

// Get number of likes for a post
export const getLikesCountForPost = async (postId: number): Promise<number> => {
  const res = await axios.get(`${BASE_URL}/likes/post/${postId}/count`);
  return res.data;
};

// Get likes by a user
export const getLikesByUser = async (username: string): Promise<Like[]> => {
  const res = await axios.get(`${BASE_URL}/likes/user/${username}`);
  return res.data;
};

// Get number of likes by a user
export const getLikesCountByUser = async (username: string): Promise<number> => {
  const res = await axios.get(`${BASE_URL}/likes/user/${username}/count`);
  return res.data;
};