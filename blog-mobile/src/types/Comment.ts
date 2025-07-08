import { Post } from "./Post";

export interface Comment {
  id: number;
  author: string;
  text: string;
  post?: Post;
  createdAt: Date | string;
}