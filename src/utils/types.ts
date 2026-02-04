
export type User = {
  id?: number;
  username: string;
  email?: string;
  password: string;
}

export type AuthContextValue = {
  user: User | null;
  signup: (username: string,email: string, password: string) => Promise<any>;
  login: (name: string, password: string) => Promise<string>;
  logout: () => void;
}

export interface PostResponse {
  id: number;
  authorUsername: string;
  content: string;
  imageUrl?: string | null;
  createdAt: string; // Instant -> ISO string
}

// Matches CreatePostRequest.java
export interface CreatePostRequest {
  content: string;
  imageUrl?: string;
}

// Matches CommentResponse.java exactly
export interface CommentResponse {
  id: number;
  authorUsername: string;
  content: string;
  createdAt: string; // Instant -> ISO string
}

// Matches CreateCommentRequest.java
export interface CreateCommentRequest {
  content: string;
}