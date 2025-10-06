import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from 'src/user/user.entity';
User

export type NotificationType = 'like' | 'comment' | 'reply' | 'follow' | 'mutual_follow';

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.sentNotifications, { onDelete: 'CASCADE' })
  actor: User; // who triggered it

  @ManyToOne(() => User, (user) => user.receivedNotifications, { onDelete: 'CASCADE' })
  recipient: User; // who receives it

  @Column({ type: 'enum', enum: ['like', 'comment', 'reply', 'follow', 'mutual_follow'] })
  type: NotificationType;

  @Column({ type: 'int', nullable: true })
  postId?: number;

  @Column({ type: 'int', nullable: true })
  commentId?: number;

  @Column({ default: false })
  isRead: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
