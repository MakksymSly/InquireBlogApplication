import { api } from './axios';
import { Comment } from '../types/Comment';
import {
  createCommentSchema,
  commentsResponseSchema,
  commentSchema,
  CreateCommentForm
} from '../schemas/comment.schema';

export const getComments = async (postId: number): Promise<Comment[]> => {
  const response = await api.get(`/comments/${postId}`);
  const parsedComments = commentsResponseSchema.parse(response.data);
  return parsedComments;
};

export const getCommentsCount = async (postId: number): Promise<number> => {
  const comments = await getComments(postId);
  return comments.length;
};

export const createComment = async (data: CreateCommentForm): Promise<Comment> => {
  const validatedData = createCommentSchema.parse(data);

  const response = await api.post('/comments', validatedData);
  return commentSchema.parse(response.data);
};

export const deleteComment = async (id: number): Promise<void> => {
  await api.delete(`/comments/${id}`);
};