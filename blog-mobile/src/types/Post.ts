export interface Post {
  id: number;
  title: string;
  content?: string;
  comments?: Comment[];
  createdAt?: Date;
  updatedAt?: Date;
}