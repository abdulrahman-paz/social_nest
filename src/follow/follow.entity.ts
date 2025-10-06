import { User } from 'src/user/user.entity';
import { Entity, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, JoinColumn } from 'typeorm';
import type { Relation } from 'typeorm';

@Entity('follows')
export class Follow {
  @PrimaryGeneratedColumn()
  id: number;

  // user who follows
  @ManyToOne("User", "following")
  @JoinColumn({name: "who_follow"})
  follow_by: Relation<User>;
  
  // user who is being followed
  @ManyToOne("User", "followers")
  @JoinColumn({name: "who_got_follow"})
  who_got_follow: Relation<User>;

  @CreateDateColumn()
  createdAt: Date;
}
