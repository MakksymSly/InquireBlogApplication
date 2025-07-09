import { IsNotEmpty, IsOptional, IsArray } from 'class-validator';

export class CreatePostDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  content: string;

  @IsOptional()
  @IsArray()
  imageUrls?: string[];
}
