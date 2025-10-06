import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Follow } from './follow.entity';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FollowService {
    constructor(
        @InjectRepository(Follow)
        private followRepo: Repository<Follow>,
        @InjectRepository(User)
        private userRepo: Repository<User>
    ) { }

    async followUser(userId: number, followingUsername: string) {
        try {
            const following = await this.userRepo.findOne({ where: { username: followingUsername } })
            const user = await this.userRepo.findOne({ where: { id: userId } });

            if (!user || !following) return new NotFoundException('User not found');

            if (user?.id === following?.id) {
                console.log("user?.id, following?.id: ", user?.id, following?.id);
                console.log("tagret user username: ", followingUsername, "the guy who tried to follow: ", userId);

                return new BadRequestException('You cannot follow yourself');
            }

            const alreadyFollowing = await this.followRepo.findOne({
                where: { follow_by: { id: userId }, who_got_follow: { id: following.id } },
            });

            if (alreadyFollowing) return new BadRequestException('You already follow this user');

            const follow = this.followRepo.create({ follow_by: user, who_got_follow: following });
            return await this.followRepo.save(follow);
        } catch (error) {
            console.error('Error:', error);
            throw new error
        }
    }

    async unfollowUser(userId: number, unfollowUsername: string) {
        try {
            const targetUser = await this.userRepo.findOne({
                where: { username: unfollowUsername },
            });
            console.log("targetUser: ", targetUser);
            console.log("unfollowUsername: ", unfollowUsername);

            const user = await this.userRepo.findOne({ where: { id: userId } });

            if (!user || !targetUser) throw new NotFoundException('User not found');

            if (user.id === targetUser.id) throw new BadRequestException('You cannot unfollow yourself');

            console.log("userId: ", userId, "targetUser.id: ", targetUser.id);


            const followRelation = await this.followRepo.findOne({
                where: { follow_by: { id: userId }, who_got_follow: { id: targetUser.id } },
            });

            if (!followRelation)
                throw new BadRequestException('You are not following this user');

            await this.followRepo.remove(followRelation);

            return { unfollowedUser: targetUser.username };
        } catch (error) {
            console.error('Error in unfollowUser:', error);
            throw error;
        }
    }

}