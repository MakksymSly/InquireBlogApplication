export interface Post {
  id: number;
  title: string;
  content: string;
  comments?: Comment[];
  commentsCount?: number;
  createdAt?: Date;
  updatedAt?: Date;
}