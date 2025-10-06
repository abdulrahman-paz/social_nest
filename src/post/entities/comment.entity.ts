import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToMany,
    CreateDateColumn,
    DeleteDateColumn,
  } from 'typeorm';
  import { Post } from './post.entity';
import { User } from 'src/user/user.entity';
import { CommentReply } from './comment-reply.entity';
  
  @Entity({ name: 'comments' })
  export class Comment {
    @PrimaryGeneratedColumn()
    id!: number;
  
    @Column({ type: 'text' })
    content!: string;
  
    @ManyToOne(() => User, (user) => user.comments, { onDelete: 'CASCADE' })
    user!: User;
  
    @ManyToOne(() => Post, (post) => post.comments, { onDelete: 'CASCADE' })
    post!: Post;
  
    // // self relation for replies (one level only)
    // @ManyToOne(() => Comment, (comment) => comment.replies, { nullable: true, onDelete: 'CASCADE' })
    // parent?: Comment | null;
  
    @OneToMany(() => CommentReply, (reply) => reply.comment)
    replies: CommentReply[];
  
    @CreateDateColumn()
    createdAt!: Date;
  
    @DeleteDateColumn({ nullable: true })
    deletedAt?: Date | null;
  }
  