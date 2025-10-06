import { Body, Controller, Delete, HttpStatus, Post, Request, UseGuards } from '@nestjs/common';
import { FollowService } from './follow.service';
import { AuthGuard } from '@nestjs/passport';
import type { Request as expressReq } from 'express';
import { FollowUserDTO } from './dto/follow-user.dto';
import { UserJwt } from 'src/common/types/user-jwt.types';

@Controller('follow')
export class FollowController {
    constructor(
        private followService: FollowService
    ) { }

    @UseGuards(AuthGuard("jwt"))
    @Post("start-follow")
    async followUser(@Request() req: expressReq, @Body() body: FollowUserDTO) {
        const user = req?.user as UserJwt;
        const userId = user.userId;
        const response = await this.followService.followUser(userId, body?.followUserUsername!)
        return {
            statusCode: HttpStatus.CREATED,
            message: "User Start Following Successfully.",
            data: response
        }
    }

    @UseGuards(AuthGuard('jwt'))
    @Delete('unfollow')
    async unfollowUser(@Request() req: expressReq, @Body() body: FollowUserDTO) {
        const user = req.user as UserJwt;
        const userId = user.userId;

        const response = await this.followService.unfollowUser(userId, body?.unfollowUserUsername!);

        return {
            statusCode: HttpStatus.OK,
            message: 'User unfollowed successfully.',
            data: response,
        };
    }
}