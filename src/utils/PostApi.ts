import axios from "axios";
import {
  PostResponse,
  CreatePostRequest,
  CommentResponse,
  CreateCommentRequest,
} from "./types";
import { POST_SERVICE_BASE_URL } from "./url";

const postClient = axios.create({
  baseURL: POST_SERVICE_BASE_URL, 
});

postClient.interceptors.request.use((config) => {
  const raw = localStorage.getItem("token");
  const token = raw?.startsWith("Bearer ") ? raw.slice(7): raw;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

postClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if(error?.response?.status === 401){
            localStorage.removeItem("token");
        }
        return Promise.reject(error);
    });

// 1) POST /posts
export const createPost = async (payload: CreatePostRequest): Promise<PostResponse> => {
  const res = await postClient.post<PostResponse>("/posts", payload);
  return res.data;
};

// 2) GET /posts/{id}
export const getPostById = async (id: number | string): Promise<PostResponse> => {
  const res = await postClient.get<PostResponse>(`/posts/${id}`);
  return res.data;
};

// 3) GET /posts
export const listPosts = async (params?: {
  authorUsername?: string;
  authorUsernames?: string[];
  limit?: number;
}): Promise<PostResponse[]> => {
  const res = await postClient.get<PostResponse[]>("/posts", { params });
  return res.data;
};

// 4) DELETE /posts/{id}
export const deletePost = async (id: number | string): Promise<void> => {
  await postClient.delete(`/posts/${id}`);
};

// 5) POST /posts/{id}/comments
export const addComment = async (
  postId: number | string,
  payload: CreateCommentRequest
): Promise<CommentResponse> => {
  const res = await postClient.post<CommentResponse>(`/posts/${postId}/comments`, payload);
  return res.data;
};

// 6) GET /posts/{id}/comments
export const listComments = async (postId: number | string): Promise<CommentResponse[]> => {
  const res = await postClient.get<CommentResponse[]>(`/posts/${postId}/comments`);
  return res.data;
};

// 7) GET /posts/internal/{id}/exists
export const postExists = async (postId: number | string): Promise<boolean> => {
  const res = await postClient.get<{ exists: boolean }>(`/posts/internal/${postId}/exists`);
  return res.data.exists;
};
