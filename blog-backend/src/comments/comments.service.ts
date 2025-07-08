import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Post } from 'src/posts/entities/post.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,

    @InjectRepository(Post)
    private postRepository: Repository<Post>,
  ) { }

  async create(dto: CreateCommentDto) {
    const post = await this.postRepository.findOneBy({ id: dto.postId });
    if (!post) throw new NotFoundException('Post not found');

    const comment = this.commentRepository.create({
      author: dto.author,
      text: dto.text,
      post,
    });

    return this.commentRepository.save(comment);
  }

  async findByPost(postId: number) {
    return this.commentRepository.find({
      where: { post: { id: postId } },
      order: { createdAt: 'DESC' },
    });
  }

  async remove(id: number) {
    const comment = await this.commentRepository.findOneBy({ id });
    if (!comment) throw new NotFoundException('Comment not found');

    return this.commentRepository.delete(id);
  }
}
