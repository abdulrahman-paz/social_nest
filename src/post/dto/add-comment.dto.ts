import { IsString, IsOptional } from 'class-validator';
import { Post as HttpPost, Body } from '@nestjs/common';

export class AddCommentDto {
  @IsString()
  content!: string;

  @IsOptional()
  parentId?: number;
}
