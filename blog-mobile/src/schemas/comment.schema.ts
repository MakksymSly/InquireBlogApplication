import { z } from 'zod';

export const createCommentSchema = z.object({
  author: z
    .string()
    .min(1, 'Name is required')
    .max(50, 'Name cannot be longer than 50 characters')
    .trim(),
  text: z
    .string()
    .min(1, 'Comment text is required')
    .max(500, 'Comment cannot be longer than 500 characters')
    .trim(),
  postId: z
    .number()
    .int('Post ID must be an integer')
    .positive('Post ID must be a positive number'),
});

export const commentSchema = z.object({
  id: z.number(),
  author: z.string(),
  text: z.string(),
  post: z.object({
    id: z.number(),
    title: z.string(),
    content: z.string(),
  }).optional(),
  createdAt: z.string().or(z.date()),
});

export const commentsResponseSchema = z.array(commentSchema);

export type CreateCommentForm = z.infer<typeof createCommentSchema>;
export type CommentResponse = z.infer<typeof commentSchema>;
export type CommentsResponse = z.infer<typeof commentsResponseSchema>; 