import { Column, Entity, Index, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Post } from './post.entity';

@Entity({ name: 'tags' })
@Index(['name'], { unique: true })
export class Tag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToMany(() => Post, (post) => post.tags)
  posts: Post[];
}