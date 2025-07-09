import { PostForm } from '../schemas/post.schema';
import { api } from './axios';

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const getPosts = async () => {
  await delay(1000);
  const response = await api.get('/posts');
  return response.data;
};

export const uploadImage = async (imageUri: string) => {
  const formData = new FormData();

  const filename = imageUri.split('/').pop() || 'image.jpg';

  const imageFile = {
    uri: imageUri,
    type: 'image/jpeg',
    name: filename,
  } as any;

  formData.append('image', imageFile);

  const response = await api.post('/upload/image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

export const createPost = async (postData: { title: string; content: string; imageUrls?: string[] }) => {
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