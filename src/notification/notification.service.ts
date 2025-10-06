import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/user/user.entity';
import { Notification } from './notification.entity';
import { firebaseMessaging } from 'src/firebase/firebase.config';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepo: Repository<Notification>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}


  async createNotification(
    actorId: number,
    recipientId: number,
    type: 'like' | 'comment' | 'reply' | 'follow' | 'mutual_follow',
    extra?: { postId?: number; commentId?: number },
  ) {
    if (actorId === recipientId) return; 

    const actor = await this.userRepo.findOne({ where: { id: actorId } });
    const recipient = await this.userRepo.findOne({ where: { id: recipientId } });

    if (!actor || !recipient) return;

    const notification = this.notificationRepo.create({
      actor,
      recipient,
      type,
      postId: extra?.postId,
      commentId: extra?.commentId,
    });
    await this.notificationRepo.save(notification);

    // send push notification (Firebase)
    if (recipient.fcmToken) {
      await firebaseMessaging().send({
        token: recipient.fcmToken,
        notification: {
          title: this.getNotificationTitle(type),
          body: `${actor.username} ${this.getNotificationBody(type)}`,
        },
        data: {
          type,
          postId: extra?.postId?.toString() || '',
          commentId: extra?.commentId?.toString() || '',
        },
      });
    }

    return { success: true };
  }

  
  async getUserNotifications(userId: number) {
    return this.notificationRepo.find({
      where: { recipient: { id: userId } },
      relations: ['actor'],
      order: { createdAt: 'DESC' },
    });
  }

 
  async markAsRead(notificationId: number) {
    await this.notificationRepo.update(notificationId, { isRead: true });
    return { success: true };
  }

  private getNotificationTitle(type: string): string {
    switch (type) {
      case 'like': return 'New Like ❤️';
      case 'comment': return 'New Comment 💬';
      case 'reply': return 'New Reply 💭';
      case 'follow': return 'New Follower 👤';
      case 'mutual_follow': return 'Mutual Follow 🔁';
      default: return 'Notification';
    }
  }

  private getNotificationBody(type: string): string {
    switch (type) {
      case 'like': return 'liked your post';
      case 'comment': return 'commented on your post';
      case 'reply': return 'replied to your comment';
      case 'follow': return 'started following you';
      case 'mutual_follow': return 'is now a mutual connection';
      default: return 'did something';
    }
  }
}
