import { Body, Controller, Delete, Get, HttpStatus, Param, ParseIntPipe, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { PostService } from './post.service';
import { AuthGuard } from '@nestjs/passport';
import type { Request as expressRequest } from 'express';
import { UserJwt } from 'src/common/types/user-jwt.types';
import { UpdatePostDto } from './dto/update-post.dto';
import { CreatePostDto } from './dto/create-post.dto';
import { AddCommentDto } from './dto/add-comment.dto';

@Controller('post')
export class PostController {
    constructor(private readonly postsService: PostService) { }

    @UseGuards(AuthGuard("jwt"))
    @Post("create-post")
    async create(@Request() req: expressRequest, @Body() body: CreatePostDto) {
        const user = req.user as UserJwt;


        const post = await this.postsService.create(user?.userId, body);
        return {
            message: "Post created successfully",
            statusCode: HttpStatus.CREATED,
            data: post
        };
    }

    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number) {
        const post = await this.postsService.findOne(id);
        return { data: post };
    }

    @UseGuards(AuthGuard('jwt'))
    @Patch(':id')
    async update(@Request() req: expressRequest, @Param('id', ParseIntPipe) id: number, @Body() body: UpdatePostDto) {
        const user = req.user as UserJwt;

        const post = await this.postsService.update(id, user?.userId, body);
        return { data: post };
    }

    @UseGuards(AuthGuard('jwt'))
    @Delete(':id')
    async remove(@Request() req: expressRequest, @Param('id', ParseIntPipe) id: number) {
        const user = req.user as UserJwt;

        await this.postsService.softDelete(id, user?.userId);
        return { message: 'Post deleted' };
    }

    @UseGuards(AuthGuard('jwt'))
    @Post(':id/like')
    async toggleLike(@Request() req: expressRequest, @Param('id', ParseIntPipe) postId: number) {
        const user = req.user as UserJwt;
        const result = await this.postsService.toggleLike(user.userId, postId);
        return { liked: result.liked };
    }

    @UseGuards(AuthGuard('jwt'))
    @Post(':postId/comments')
    async addComment(
        @Request() req: expressRequest,
        @Param('postId', ParseIntPipe) postId: number,
        @Body() body: { content: string },
    ) {
        const user = req.user as UserJwt;

        return this.postsService.addComment(user.userId, postId, body);
    }

    @Get(':id/comments')
    async getComments(@Param('id', ParseIntPipe) postId: number) {
        const comments = await this.postsService.getComments(postId);
        return { data: comments };
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('comments/:commentId/replies')
    async addReply(
        @Request() req: expressRequest,
        @Param('commentId', ParseIntPipe) commentId: number,
        @Body('content') content: string,
    ) {
        const user = req.user as UserJwt;

        return this.postsService.addReply(user.userId, commentId, content);
    }
}