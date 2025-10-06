import { ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tag } from './entities/tag.entity';
import { PostMedia } from './entities/post-media.entity';
import { In, Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { User } from 'src/user/user.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostLike } from './entities/post-like.entity';
import { Comment } from './entities/comment.entity';
import { CommentReply } from './entities/comment-reply.entity';
import { NotificationsService } from 'src/notification/notification.service';

@Injectable()
export class PostService {
    constructor(
        @InjectRepository(Post)
        private readonly postRepo: Repository<Post>,
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
        @InjectRepository(Tag)
        private readonly tagRepo: Repository<Tag>,
        @InjectRepository(PostMedia)
        private readonly mediaRepo: Repository<PostMedia>,
        @InjectRepository(PostLike)
        private readonly likeRepo: Repository<PostLike>,
        @InjectRepository(Comment)
        private readonly commentRepo: Repository<Comment>,
        @InjectRepository(CommentReply)
        private readonly replyRepo: Repository<CommentReply>,

        private notificationService: NotificationsService
    ) { }

    async create(authorId: number, dto: CreatePostDto) {
        try {
            const user = await this.userRepo.findOne({ where: { id: authorId } });
            if (!user) {
                throw new NotFoundException('Author not found');
            }

            console.log("dto: ", dto);

            console.log("============1===========");



            const post = this.postRepo.create();
            post.user = user;
            post.type = dto.type;
            post.content = dto?.content!;
            post.visibility = dto.visibility ?? 'public';

            // Tags: normalize and either find existing or create new
            post.tags = [];
            if (dto.tags && dto.tags.length) {
                const normalized = dto.tags.map((t) => t.toLowerCase().trim());
                const existing = await this.tagRepo.find({ where: { name: In(normalized) } });
                const existingNames = new Set(existing.map((t) => t.name));

                post.tags.push(...existing);
                for (const n of normalized) {
                    if (!existingNames.has(n)) {
                        const newTag = this.tagRepo.create({ name: n });
                        await this.tagRepo.save(newTag);
                        post.tags.push(newTag);
                    }
                }
            }
            // Media: mediaUrls must be produced by a separate upload service (S3, ImageKit, etc.)
            post.media = [];
            if (dto.mediaUrls && dto.mediaUrls.length) {
                for (const m of dto.mediaUrls) {
                    const media = this.mediaRepo.create({ url: m.url, mimeType: m.mimeType ?? 'application/octet-stream', mediaType: this.detectMediaType(m.mimeType), sizeBytes: m.sizeBytes });
                    post.media.push(media);
                }
            }

            return this.postRepo.save(post);
        } catch (error) {
            console.log("ERROR: ", error);
            throw new InternalServerErrorException(error.message)
        }
    }

    private detectMediaType(mime?: string) {
        if (!mime) return 'other';
        if (mime.startsWith('audio/')) return 'audio';
        if (mime.startsWith('video/')) return 'video';
        return 'other';
    }


    async findOne(id: number, includeDeleted = false) {
        try {
            const post = await this.postRepo.findOne({ where: { id }, relations: ['user', 'tags', 'media'] });
            if (!post) throw new NotFoundException('Post not found');
            if (post.deletedAt && !includeDeleted) throw new NotFoundException('Post not found');
            return post;
        } catch (error) {
            console.log("ERROR: ", error);
            throw error
        }
    }

    async update(id: number, authorId: number, dto: UpdatePostDto) {
        try {

            const user = await this.userRepo.findOne({ where: { id: authorId } });
            if (!user) {
                throw new NotFoundException('Author not found');
            }

            const post = await this.findOne(id);
            if (post.user.id !== user.id) throw new ForbiddenException('Not allowed');

            if (dto.content !== undefined) post.content = dto.content;
            if (dto.visibility !== undefined) post.visibility = dto.visibility;


            if (dto.tags) {
                const normalized = dto.tags.map((t) => t.toLowerCase().trim());
                const existing = await this.tagRepo.find({ where: { name: In(normalized) } });
                const existingNames = new Set(existing.map((t) => t.name));
                const newTags: Tag[] = [];
                newTags.push(...existing);
                for (const n of normalized) {
                    if (!existingNames.has(n)) {
                        const newTag = this.tagRepo.create({ name: n });
                        await this.tagRepo.save(newTag);
                        newTags.push(newTag);
                    }
                }
                post.tags = newTags;
            }

            // Replace media if provided. Note: deletion from storage should be handled by a separate media service.
            if (dto.mediaUrls) {
                // Remove existing media rows
                if (post.media && post.media.length) {
                    await this.mediaRepo.remove(post.media);
                }
                post.media = [];
                for (const m of dto.mediaUrls) {
                    const media = this.mediaRepo.create({ url: m.url, mimeType: m.mimeType ?? 'application/octet-stream', mediaType: this.detectMediaType(m.mimeType), sizeBytes: m.sizeBytes });
                    post.media.push(media);
                }
            }

            return this.postRepo.save(post);
        } catch (error) {
            console.log("ERROR: ", error);
            throw error
        }
    }

    async softDelete(id: number, authorId: number) {
        try {
            const user = await this.userRepo.findOne({ where: { id: authorId } });
            if (!user) {
                throw new NotFoundException('Author not found');
            }

            const post = await this.findOne(id);
            if (post.user.id !== user.id) throw new ForbiddenException('Not allowed');

            // Use repository softDelete to avoid cascading soft-delete to relations like Tag
            await this.postRepo.softDelete({ id: post.id });
        } catch (error) {
            console.log("ERROR: ", error);
            throw error
        }
    }

    async toggleLike(userId: number, postId: number) {
        try {
            console.log("postId: ", postId);

            const post = await this.findOne(postId);
            const existing = await this.likeRepo.findOne({ where: { user: { id: userId }, post: { id: postId } } });

            if (existing) {
                await this.likeRepo.remove(existing);
                return { liked: false };
            } else {
                const user = await this.userRepo.findOne({ where: { id: userId } });
                if (!user) {
                    throw new NotFoundException('User not found');
                }
                const like = this.likeRepo.create({ user, post });
                await this.likeRepo.save(like);
                
                await this.notificationService.createNotification(
                    userId,
                    post.user.id,
                    "like",
                    { postId },
                  );

                return { liked: true };
            }

        } catch (error) {
            console.log("ERROR: ", error);
            throw error
        }
    }

    async getLikeCount(postId: number) {
        try {
            return this.likeRepo.count({ where: { post: { id: postId } } });

        } catch (error) {
            console.log("ERROR: ", error);
            throw error
        }
    }

    // async addComment(userId: number, postId: number, content: string, parentId?: number) {
    //     try {
    //         const post = await this.findOne(postId);
    //         let parentComment: Comment | null = null;

    //         if (parentId) {
    //             parentComment = await this.commentRepo.findOne({ where: { id: parentId }, relations: ['post'] });
    //             if (!parentComment) throw new NotFoundException('Parent comment not found');
    //             if (parentComment.post.id !== post.id) throw new ForbiddenException('Reply must belong to same post');
    //         }

    //         const user = await this.userRepo.findOne({ where: { id: userId } });
    //         if (!user) {
    //             throw new NotFoundException('User not found');
    //         }

    //         const comment = this.commentRepo.create({ content, user, post, parent: parentComment || null });
    //         return this.commentRepo.save(comment);
    //     } catch (error) {
    //         console.log("ERROR: ", error);
    //         throw error
    //     }
    // }

    async addComment(userId: number, postId: number, body: { content: string }) {
        try {
            const post = await this.postRepo.findOne({ where: { id: postId } });
            if (!post) throw new NotFoundException('Post not found');

            const user = await this.userRepo.findOne({ where: { id: userId } });
            if (!user) throw new NotFoundException('User not found');

            const comment = this.commentRepo.create({ content: body.content, post, user });
            const saved = await this.commentRepo.save(comment);

            await this.notificationService.createNotification(
                userId,
                post.user.id,
                'comment',
                { postId: post.id, commentId: saved.id },
            );

            return saved;
        } catch (error) {
            console.log("ERROR: ", error);
            throw error
        }
    }

    async getComments(postId: number) {
        try {
            const post = await this.postRepo.findOne({ where: { id: postId } });
            if (!post) throw new NotFoundException('Post not found');

            return await this.commentRepo.find({
                where: { post },
                relations: ['user', 'replies', 'replies.user'],
                order: { createdAt: 'DESC' },
            });
        } catch (error) {
            console.log("ERROR: ", error);
            throw error
        }
    }

    async addReply(userId: number, commentId: number, content: string) {
        try {
            console.log("userId: ", userId);
            
            const comment = await this.commentRepo.findOne({ where: { id: commentId } });
            if (!comment) throw new NotFoundException('Comment not found');

            const user = await this.userRepo.findOne({ where: { id: userId } });
            if (!user) throw new NotFoundException('User not found');

            const reply = this.replyRepo.create({ content, user, comment });
            const saved = await this.replyRepo.save(reply);

            // notify original commenter about reply
            await this.notificationService.createNotification(
                userId,
                comment.user.id,
                'reply',
                { postId: comment.post?.id, commentId: comment.id },
            );

            return saved;
        } catch (error) {
            console.log("ERROR: ", error);
            throw error
        }
    }
} 