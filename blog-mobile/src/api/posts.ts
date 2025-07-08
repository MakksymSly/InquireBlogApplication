import { PostForm } from '../schemas/post.schema';
import { api } from './axios';

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const getPosts = async () => {
  await delay(1000);
  const response = await api.get('/posts');
  return response.data;
};

export const createPost = async (postData: { title: string; content: string }) => {
  await delay(1000);
  const response = await api.post('/posts', postData);
  return response.data;
};

export const deletePost = async (id: number) => {
  await delay(1000);
  return api.delete(`/posts/${id}`);
};

export const updatePost = async (id: number, data: PostForm) => {
  await delay(1000);
  return api.put(`/posts/${id}`, data);
};