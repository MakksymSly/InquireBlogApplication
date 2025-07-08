import { create } from 'zustand';
import { Comment } from '../types/Comment';

interface CommentStore {
  comments: Comment[];
  setComments: (comments: Comment[]) => void;
  addComment: (comment: Comment) => void;
  removeComment: (id: number) => void;
  clearComments: () => void;
}

export const useCommentStore = create<CommentStore>((set) => ({
  comments: [],
  setComments: (comments: Comment[]) => set({ comments }),
  addComment: (comment: Comment) => set((state) => ({
    comments: [comment, ...state.comments]
  })),
  removeComment: (id: number) => set((state) => ({
    comments: state.comments.filter(comment => comment.id !== id)
  })),
  clearComments: () => set({ comments: [] }),
}));