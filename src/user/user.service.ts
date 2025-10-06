import { BadRequestException, HttpStatus, Inject, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from "bcrypt"
import { LoginDto } from './dto/login.dto';
import { MailService } from 'src/mail/mail.service';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { Follow } from 'src/follow/follow.entity';
import { Post } from 'src/post/entities/post.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepo: Repository<User>,

        @InjectRepository(Follow)
        private followRepo: Repository<Follow>,

        @InjectRepository(Post)
        private postRepo: Repository<Post>,

        private readonly mailService: MailService,
        private jwtService: JwtService
    ) { }

    async register(body: CreateUserDto) {
        try {
            const exists = await this.userRepo.findOne({ where: { username: body.username } });
            if (exists) throw new BadRequestException('Username already exists');

            // generate 6 digit random code
            const verifyCode = Math.floor(100000 + Math.random() * 900000);

            const hashed = await bcrypt.hash(body.password, 10);

            const user = this.userRepo.create({
                username: body.username,
                email: body.email,
                password: hashed,
                avatarUrl: body.avatarUrl,
                verifyCode,
                verificationCodeExpiry: new Date(Date.now() + 60 * 60 * 1000) // expire this in one hour
            });

            this.mailService.sendVerificationEmail(body.email, verifyCode, body.username)

            return this.userRepo.save(user);
        } catch (error) {
            console.error('Error:', error);
            throw new InternalServerErrorException(error.message);
        }
    }

    async login(body: LoginDto) {
        try {

            const user = await this.userRepo.findOne({
                where: { username: body.username },
            });

            if (!user) {
                throw new NotFoundException('User not found');
            }

            if (!user.isVerified) {
                throw new BadRequestException('Please verify your account first.');
            }

            const isPasswordMatch = await bcrypt.compare(body.password, user.password);
            if (!isPasswordMatch) {
                throw new UnauthorizedException('Invalid password');
            }

            console.log("=====1=====");


            const payload = {
                sub: user.id,
                username: user.username,
            };

            console.log("=====2=====");

            const token = this.jwtService.sign(payload)

            console.log("=====3=====");

            return token;
        } catch (error) {
            console.error('Error:', error);
            throw new InternalServerErrorException(error.message);
        }
    }

    async verifyUser(body: { username: string, code: number }) {
        try {

            const user = await this.userRepo.findOne({ where: { username: body.username } });

            if (!user) {
                throw new NotFoundException('User not found');
            }

            if (user.isVerified) {
                throw new BadRequestException('User already verified');
            }

            if (user.verifyCode !== body.code) {
                throw new BadRequestException('Invalid verification code');
            }

            const now = new Date();
            if (user.verificationCodeExpiry && user.verificationCodeExpiry < now) {
                throw new BadRequestException('Verification code expired');
            }

            user.isVerified = true;
            user.verifyCode = null;
            user.verificationCodeExpiry = null;
            await this.userRepo.save(user);

            return { message: 'User verified successfully' }
        } catch (error) {
            console.error('Error:', error);
            throw new InternalServerErrorException(error.message);
        }
    }

    async logout(res: Response) {
        try {
            (res as any).clearCookie('access_token', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
            });

            return {
                statusCode: HttpStatus.OK,
                message: 'Logged out successfully',
            };
        } catch (error) {
            console.error('Error:', error);
            throw new InternalServerErrorException(error.message);

        }
    }

    async getUserDetails(userId: number) {
        const user = await this.userRepo.findOne({ where: { id: userId } });
        if (!user) throw new NotFoundException('User not found');

        const postCount = await this.postRepo.count({
            where: { user: { id: userId } },
        });

        const followersCount = await this.followRepo.count({
            where: { who_got_follow: { id: userId } },
        });

        const followingCount = await this.followRepo.count({
            where: { follow_by: { id: userId } },
        });

        return {
            id: user.id,
            username: user.username,
            email: user.email,
            avatarUrl: user.avatarUrl,
            isVerified: user.isVerified,
            postsCount: postCount,
            followersCount,
            followingCount,
            createdAt: user.createdAt,
        };
    }

    async updateFcmToken(userId: number, fcmToken: string) {
        await this.userRepo.update(userId, { fcmToken });
        return { message: 'FCM token updated successfully' };
      }      

}