import { Controller, Get, Patch, Param, ParseIntPipe } from '@nestjs/common';
import { NotificationsService } from './notification.service';


@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationService: NotificationsService) {}

  @Get(':userId')
  async getUserNotifications(@Param('userId', ParseIntPipe) userId: number) {
    return this.notificationService.getUserNotifications(userId);
  }

  @Patch(':notificationId/read')
  async markAsRead(@Param('notificationId', ParseIntPipe) id: number) {
    return this.notificationService.markAsRead(id);
  }
}
