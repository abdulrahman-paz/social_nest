import { Body, Controller, Get, HttpStatus, Patch, Post, Request, Res, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';
import { UserJwt } from 'src/common/types/user-jwt.types';
import type { Request as expressRequest } from 'express';

@Controller('user')
export class UserController {
    constructor(
        private userService: UserService
    ) { }

    @Post("signup")
    async signup(@Body() body: CreateUserDto) {
        try {
            const res = await this.userService.register(body);
            return {
                statusCode: HttpStatus.CREATED,
                message: "User Created Successfully.",
                data: res
            }
        } catch (error) {
            console.log("error: ", error);
            return {
                success: HttpStatus.INTERNAL_SERVER_ERROR,
                message: error.message
            }
        }
    }

    @Post("verify-user")
    async verifyUser(@Body() body: { code: number, username: string }) {
        try {
            const res = await this.userService.verifyUser(body);
            return {
                statusCode: HttpStatus.OK,
                message: res.message,
                data: res
            }
        } catch (error) {
            console.log("error: ", error);
            return {
                success: HttpStatus.INTERNAL_SERVER_ERROR,
                message: error.message
            }
        }
    }

    @Post("login")
    async login(@Body() body: LoginDto, @Res({ passthrough: true }) res: Response) {
        try {
            const token = await this.userService.login(body);

            (res as any).cookie('access_token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                overwrite: true
            });


            console.log("=====4=====: ", token);

            return {
                statusCode: HttpStatus.OK,
                message: "User login Successfully."
            }
        } catch (error) {
            console.log("error in login: ", error);
            return {
                success: HttpStatus.INTERNAL_SERVER_ERROR,
                message: error.message
            }
        }
    }

    @UseGuards(AuthGuard("jwt"))
    @Post('logout')
    async logout(@Res({ passthrough: true }) res: Response) {
        const response = await this.userService.logout(res as any);
        return response
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('me')
    async getLoggedInUser(@Request() req: expressRequest) {
        const user = req?.user as UserJwt;
        const userId = user.userId;

        const userDetails = await this.userService.getUserDetails(userId);

        return {
            statusCode: HttpStatus.OK,
            message: 'User details fetched successfully',
            data: userDetails,
        };
    }

    @UseGuards(AuthGuard('jwt'))
    @Patch('fcm-token')
    async updateFcmToken(
        @Request() req,
        @Body('fcmToken') fcmToken: string,
    ) {
        const user = req.user as UserJwt;
        return this.userService.updateFcmToken(user.userId, fcmToken);
    }

}