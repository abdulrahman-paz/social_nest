import { IsEnum, IsNotEmpty, IsOptional, IsString, IsArray, ArrayMaxSize } from 'class-validator';

// export enum PostType {
//     TEXT = 'text',
//     AUDIO = 'audio',
//     VIDEO = 'video',
// }

export enum Visibility {
    PUBLIC = 'public',
    MUTUAL_ONLY = 'mutual_only',
    PRIVATE = 'private',
}

export class CreatePostDto {
    @IsOptional()
    @IsString()
    content?: string;

    // @IsNotEmpty()
    // @IsEnum(PostType)
    // type!: PostType;

    @IsNotEmpty()
    // @IsEnum(PostType)
    type!: "text" | "audio" | "video";

    @IsOptional()
    @IsArray()
    @ArrayMaxSize(10)
    tags?: string[];

    @IsOptional()
    @IsArray()
    @ArrayMaxSize(5)
    mediaUrls?: { url: string; mimeType?: string; sizeBytes?: number }[];

    @IsOptional()
    @IsEnum(Visibility)
    visibility?: Visibility;
}