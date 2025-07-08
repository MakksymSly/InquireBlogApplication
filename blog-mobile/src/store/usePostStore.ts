import { create } from 'zustand';

interface Post {
  id: number;
  title: string;
  body: string;
}

interface PostStore {
  posts: Post[];
  setPosts: (posts: Post[]) => void;
  addPost: (post: Post) => void;
  removePost: (id: number) => void;
}

export const usePostStore = create<PostStore>((set) => ({
  posts: [],
  setPosts: (posts) => set({ posts }),
  addPost: (post) => set((state) => ({ posts: [...state.posts, post] })),
  removePost: (id) =>
    set((state) => ({ posts: state.posts.filter((p) => p.id !== id) })),
}));