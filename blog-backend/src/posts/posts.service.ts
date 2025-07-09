import { CreatePostDto } from './dto/create-post.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { unlink } from 'fs/promises';
import { join } from 'path';

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
    const post = await this.postRepository.findOneBy({ id });
    if (!post) throw new NotFoundException('Post not found');

    if (post.imageUrls && post.imageUrls.length > 0) {
      for (const imageUrl of post.imageUrls) {
        try {
          const filename = imageUrl.split('/').pop();
          if (filename) {
            const filePath = join(__dirname, '..', '..', 'uploads', filename);
            await unlink(filePath);
          }
        } catch (error) {
          console.error(`Error deleting image file: ${imageUrl}`, error);
        }
      }
    }

    const result = await this.postRepository.delete(id);
    if (!result.affected) throw new NotFoundException('Post not found');

    return { deleted: true };
  }
}
