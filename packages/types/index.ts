export interface User {
  id: string;
  username: string;
  email: string;
  name: string;
  bio: string;
  profilePicture: any;
  createdAt: Date;
  updatedAt: Date;
}

export interface Post {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  authorId: string;
  media?: Media[];
  author?: User;
  likes?: unknown[];
  comments?: unknown[];
}

export interface Media {
  id: string;
  type: string;
  url: string;
  deleteHash: string;
  description: string | null;
  createdAt: Date;
  postId: string;
  post?: Post;
}

export interface PostCreateInput {
  content: string;
  authorId: string;
}

export interface MediaCreateInput {
  type: string;
  url: string;
  deleteHash: string;
  description?: string;
  postId: string;
}

export interface APISuccessResponse<T = any> {
  status: number;
  message: string;
  data: T;
}

export interface APIPaginatedResponse<T> extends APISuccessResponse<T> {
  nextCursor: string;
  hasNextPage: boolean;
}
