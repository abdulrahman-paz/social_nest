import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { entities } from './entities/index.entities';
import { ConfigModule } from '@nestjs/config';
import { MailModule } from './mail/mail.module';
import { FollowModule } from './follow/follow.module';
import { PostModule } from './post/post.module';
import { NotificationsModule } from './notification/notification.module';
import { FeedModule } from './feed/feed.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT) || 5432,
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      entities: [...entities],
      synchronize: true,
      logging: false,
      ssl: true
    }),
    UserModule,
    MailModule,
    FollowModule,
    PostModule,
    NotificationsModule,
    FeedModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
