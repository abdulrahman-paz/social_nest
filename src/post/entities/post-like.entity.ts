import { Entity, PrimaryGeneratedColumn, ManyToOne, Unique, CreateDateColumn } from 'typeorm';
import { Post } from './post.entity';
import { User } from 'src/user/user.entity';

@Entity({ name: 'post_likes' })
@Unique(['user', 'post']) // one like per user per post
export class PostLike {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, (user) => user.postLikes, { onDelete: 'CASCADE' })
  user!: User;

  @ManyToOne(() => Post, (post) => post.postLikes, { onDelete: 'CASCADE' })
  post!: Post;

  @CreateDateColumn()
  createdAt!: Date;
}