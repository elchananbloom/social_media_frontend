import axios from "axios";
import { SOCIAL_SERVICE_BASE_URL } from "../utils/url";

const BASE_URL = `${SOCIAL_SERVICE_BASE_URL}/api/social`;

// Follow user
export const followUser = async (followeeUsername: string): Promise<void> => {
  await axios.post(`${BASE_URL}/follow/${followeeUsername}`, {}, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

// Unfollow user
export const unfollowUser = async (followeeUsername: string): Promise<void> => {
  await axios.delete(`${BASE_URL}/follow/${followeeUsername}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

// Get followers of a user
export const getFollowers = async (followeeUsername: string): Promise<string[]> => {
  const res = await axios.get(`${BASE_URL}/followers/${followeeUsername}`);
  return res.data;
};

// Get following of a user
export const getFollowing = async (followerUsername: string): Promise<string[]> => {
  const res = await axios.get(`${BASE_URL}/following/${followerUsername}`);
  return res.data;
};