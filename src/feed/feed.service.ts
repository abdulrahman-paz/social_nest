import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Post } from 'src/post/entities/post.entity';
import { Follow } from 'src/follow/follow.entity';
import { PostLike } from 'src/post/entities/post-like.entity';
import { Comment } from 'src/post/entities/comment.entity';

@Injectable()
export class FeedService {
    constructor(
        @InjectRepository(Post)
        private readonly postRepo: Repository<Post>,


        @InjectRepository(Follow)
        private readonly followRepo: Repository<Follow>,


        @InjectRepository(PostLike)
        private readonly likeRepo: Repository<PostLike>,


        @InjectRepository(Comment)
        private readonly commentRepo: Repository<Comment>,
    ) { }

    async getUserFeed(userId: number, page = 1, limit = 10) {
        const skip = (page - 1) * limit;

        // Step 1: Find the users that current user follows
        const following = await this.followRepo.find({
            where: { who_got_follow: { id: userId } },
            relations: ['who_got_follow'],
        });

        console.log("following: ", following);

        // Extract the followed user IDs
        const followingIds = following.map((f) => f.who_got_follow.id);

        console.log("followingIds: ", followingIds);


        // // Step 2: Get posts that are either:
        // // - Public posts
        // // - OR from the users the current user follows
        const [posts, total] = await this.postRepo.findAndCount({
            where: [
                { visibility: 'public' },
                { user: { id: In(followingIds) } },
            ],
            order: { createdAt: 'DESC' },
            skip,
            take: limit,
            relations: ['user'],
        });

        console.log("posts, total: ", posts, total);

        // Step 3: Return paginated result
        return {
            total,
            page,
            limit,
            posts,
        };
    }

}