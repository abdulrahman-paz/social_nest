import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Tag } from './entities/tag.entity';
import { PostMedia } from './entities/post-media.entity';
import { User } from 'src/user/user.entity';
import { Comment } from './entities/comment.entity';
import { PostLike } from './entities/post-like.entity';
import { CommentReply } from './entities/comment-reply.entity';
import { NotificationsModule } from 'src/notification/notification.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Post,
      Tag,
      PostMedia,
      User,
      PostLike, 
      Comment,
      CommentReply
    ]),
    NotificationsModule
  ],
  controllers: [PostController],
  providers: [PostService]
})
export class PostModule {}
