import { create } from 'zustand';
import { Post } from '../types/Post';

interface PostStore {
  posts: Post[];
  setPosts: (posts: Post[]) => void;
  addPost: (post: Post) => void;
  removePost: (id: number) => void;
  updateCommentsCount: (postId: number, count: number) => void;
}

export const usePostStore = create<PostStore>((set) => ({
  posts: [],
  setPosts: (posts) => set({ posts }),
  addPost: (post) => set((state) => ({ posts: [...state.posts, post] })),
  removePost: (id) =>
    set((state) => ({ posts: state.posts.filter((p) => p.id !== id) })),
  updateCommentsCount: (postId, count) =>
    set((state) => ({
      posts: state.posts.map((post) =>
        post.id === postId ? { ...post, commentsCount: count } : post
      ),
    })),
}));