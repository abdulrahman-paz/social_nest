import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import type { Relation } from 'typeorm';
import { PostMedia } from './post-media.entity';
import { Tag } from './tag.entity';
import { User } from 'src/user/user.entity';
import { Comment } from './comment.entity';
import { PostLike } from './post-like.entity';

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  content: string;

  @OneToMany(() => PostMedia, (media) => media.post)
  media: PostMedia[];

  @Column({ default: 'text' })
  type: 'text' | 'audio' | 'video';

  @Column({ default: 'public' })
  visibility: 'public' | 'mutual_only' | 'private';

  @ManyToMany(() => Tag, (tag) => tag.posts, { cascade: ["insert"] })
  @JoinTable({ name: 'post_tags' })
  tags!: Tag[];

  @ManyToOne("User", "posts")
  user: Relation<User>;

  @OneToMany(() => PostLike, (like) => like.post)
  postLikes: PostLike[];

  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamptz', nullable: true })
  deletedAt?: Date | null;
}
