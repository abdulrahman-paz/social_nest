import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';
import { MailModule } from 'src/mail/mail.module';
import { Follow } from 'src/follow/follow.entity';
import { Post } from 'src/post/entities/post.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Post,
      Follow    
    ]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>("JWT_SECRET"),
        signOptions: { expiresIn: "1h" }
      })
    }),
    MailModule
  ],
  controllers: [UserController],
  providers: [UserService, JwtStrategy]
})
export class UserModule { }
