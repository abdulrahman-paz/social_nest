import { User } from "src/user/user.entity"
import { Tag } from "src/post/entities/tag.entity"
import { PostMedia } from "src/post/entities/post-media.entity"
import { Follow } from "src/follow/follow.entity"
import { Post } from "src/post/entities/post.entity"
import { PostLike } from "src/post/entities/post-like.entity"
import { Comment } from "src/post/entities/comment.entity"
import { CommentReply } from "src/post/entities/comment-reply.entity"
import { Notification } from "src/notification/notification.entity"

export const entities = [
    User,
    Post,
    Tag,
    Follow,
    PostMedia,
    PostLike,
    Comment,
    CommentReply,
    Notification
]
