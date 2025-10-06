// import { Follow } from "src/follow/follow.entity";
// import { Column, CreateDateColumn, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
// import type { Relation } from "typeorm";
// // import { Follow } from../entities/';
// // import { Like } from './like.entity';
// // import { Comment } from './comment.entity';
// // import { Notification } from './notification.entity';


// @Entity("users")
// export class User {
//     @PrimaryGeneratedColumn()
//     id: number

//     @Column({ unique: true })
//     email: string

//     @Column()
//     password: string

//     @Column({ unique: true })
//     username: string

//     @Column({ default: false })
//     isVerified: boolean;

//     @Column({ type: 'int', nullable: true })
//     verifyCode: number | null;

//     @Column({ type: 'timestamp', nullable: true })
//     verificationCodeExpiry: Date | null

//     @Column({ type: "varchar", nullable: true })
//     avatarUrl: string | null

//     @OneToMany("Post", "user")
//     posts: Relation<any>[];

//     @OneToMany("Follow", "who_got_follow")
//     // @JoinColumn({name: "follow_by"})
//     followers: Relation<Follow>[];

//     @OneToMany("Follow", "follow_by")
//     // @JoinColumn({name: "who_got_follow"})
//     following: Relation<any>[];

//     // @OneToMany(() => Like, (like) => like.user)
//     // likes: Like[];

//     // @OneToMany(() => Comment, (comment) => comment.user)
//     // comments: Comment[];

//     // @OneToMany(() => Notification, (notification) => notification.recipient)
//     // notifications: Notification[];

//     @CreateDateColumn()
//     createdAt: Date

//     @UpdateDateColumn()
//     updatedAt: Date
// }



import { Follow } from "src/follow/follow.entity";
import { Notification } from "src/notification/notification.entity";
import { CommentReply } from "src/post/entities/comment-reply.entity";
import { Comment } from "src/post/entities/comment.entity";
import { PostLike } from "src/post/entities/post-like.entity";
import { Post } from "src/post/entities/post.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
// import { Follow } from../entities/';
// import { Like } from './like.entity';
// import { Comment } from './comment.entity';
// import { Notification } from './notification.entity';


@Entity("users")
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ unique: true })
    email: string

    @Column()
    password: string

    @Column({ unique: true })
    username: string

    @Column({ default: false })
    isVerified: boolean;

    @Column({ type: 'int', nullable: true })
    verifyCode: number | null;

    @Column({ type: 'timestamp', nullable: true })
    verificationCodeExpiry: Date | null

    @Column({ type: "varchar", nullable: true })
    avatarUrl: string | null

    @OneToMany(() => Post, (post) => post.user)
    posts: Post[];

    @OneToMany(() => Follow, (follow) => follow.who_got_follow)
    // @JoinColumn({name: "follow_by"})
    followers: Follow[];

    @OneToMany(() => Follow, (follow) => follow.follow_by)
    // @JoinColumn({name: "who_got_follow"})
    following: Follow[];

    @OneToMany(() => PostLike, (like) => like.user)
    postLikes: PostLike[];

    @OneToMany(() => Comment, (comment) => comment.user)
    comments: Comment[];

    @OneToMany(() => CommentReply, (reply) => reply.user)
    commentReplies: CommentReply[];

    @Column({ type: 'text', nullable: true })
    fcmToken?: string;

    @OneToMany(() => Notification, (notification) => notification.actor)
    sentNotifications: Notification[];

    @OneToMany(() => Notification, (notification) => notification.recipient)
    receivedNotifications: Notification[];

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}