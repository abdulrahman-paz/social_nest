import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Post } from './post.entity';
import type { MediaType } from 'src/common/types/media.types';

@Entity({ name: 'post_media' })
export class PostMedia {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  url: string;

  @Column({ type: 'varchar', length: 20 })
  mimeType!: string;

  @Column({ type: 'varchar', length: 20 })
  mediaType!: MediaType;

  @Column({ nullable: true })
  sizeBytes?: number;

  @ManyToOne(() => Post, (post) => post.media, { onDelete: 'CASCADE' })
  post: Post;
}