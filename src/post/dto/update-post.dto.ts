import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsArray, ArrayMaxSize } from 'class-validator';
import { CreatePostDto } from './create-post.dto';


export class UpdatePostDto extends PartialType(CreatePostDto) {

    @IsOptional()
    @IsArray()
    @ArrayMaxSize(5)
    mediaUrls?: { url: string; mimeType?: string; sizeBytes?: number }[];

    @IsOptional()
    @IsArray()
    @ArrayMaxSize(10)
    tags?: string[];
}