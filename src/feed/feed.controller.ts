import { Controller, Get, Query, Request, UseGuards } from '@nestjs/common';
import { FeedService } from './feed.service';
import { AuthGuard } from '@nestjs/passport';
import type { Request as expressReq } from 'express';
import { UserJwt } from 'src/common/types/user-jwt.types';

@Controller('feed')
export class FeedController {
    constructor(private readonly feedService: FeedService) { }


    @UseGuards(AuthGuard('jwt'))
    @Get()
    async getFeed(
        @Request() req: expressReq,
        @Query('page') page = 1,
        @Query('limit') limit = 10,
    ) {

        const user = req.user as UserJwt;
        const userId = user.userId;

        return this.feedService.getUserFeed(userId, Number(page), Number(limit));
    }
}