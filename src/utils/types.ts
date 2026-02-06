
export type User = {
  id?: number;
  username: string;
  email?: string;
  profilePictureUrl?: string;
  password: string;
}

export type AuthContextValue = {
  user: User | null;
  signup: (username: string, email: string, password: string) => Promise<any>;
  login: (name: string, password: string) => Promise<string>;
  logout: () => void;
}

export interface PostResponse {
  id: number;
  authorUsername: string;
  authorProfilePictureUrl?: string;
  content: string;
  imageUrl?: string | null;
  createdAt: string;
  commentCount: number;
  likesCount: number;
  isLikedByCurrentUser: boolean;
}



export interface CreatePostRequest {
  content: string;
  imageUrl?: string;
}


export interface CommentResponse {
  id: number;
  postId: number;
  authorUsername: string;
  authorProfilePictureUrl?: string;
  content: string;
  createdAt: string;
}


export interface CreateCommentRequest {
  content: string;
}

export type Profile = {
  id: number;
  username: string;
  aboutMe?: string;
  displayName?: string;
  profilePictureUrl?: string;
  location?: string;
  birthdate?: string;
  gender?: string;
  secondaryImageUrl?: string;
  phoneNumber?: string;
}
