import { CreatePostDto } from './dto/create-post.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
  ) { }

  create(dto: CreatePostDto) {
    const post = this.postRepository.create(dto);
    return this.postRepository.save(post);
  }

  findAll() {
    return this.postRepository.find({
      relations: ['comments'],
      order: { createdAt: 'DESC' },
    });
  }

  findOne(id: number) {
    return this.postRepository.findOne({
      where: { id },
      relations: ['comments'],
    });
  }

  async update(id: number, dto: CreatePostDto) {
    const post = await this.postRepository.findOneBy({ id });
    if (!post) throw new NotFoundException('Post not found');
    return this.postRepository.save({ ...post, ...dto });
  }

  async remove(id: number) {
    const result = await this.postRepository.delete(id);
    if (!result.affected) throw new NotFoundException('Post not found');
    return { deleted: true };
  }
}
