import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Comment } from './comment.entity';
import { User } from 'src/user/user.entity';

@Entity('comment_replies')
export class CommentReply {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  content: string;

  @ManyToOne(() => User, (user) => user.commentReplies, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Comment, (comment) => comment.replies, { onDelete: 'CASCADE' })
  comment: Comment;

  @CreateDateColumn()
  createdAt: Date;
}
