import { Module } from '@nestjs/common';
import { FeedController } from './feed.controller';
import { FeedService } from './feed.service';
import { Follow } from 'src/follow/follow.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostLike } from 'src/post/entities/post-like.entity';
import { Comment } from 'src/post/entities/comment.entity';
import { Post } from 'src/post/entities/post.entity';

@Module({
  imports: [TypeOrmModule.forFeature([
    Post,
    Follow,
    PostLike,
    Comment
  ])],
  controllers: [FeedController],
  providers: [FeedService]
})
export class FeedModule { }
