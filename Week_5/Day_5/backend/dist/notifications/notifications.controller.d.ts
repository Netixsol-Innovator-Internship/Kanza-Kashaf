import { NotificationsService } from './notifications.service';
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    list(req: any): Promise<(import("mongoose").Document<unknown, {}, import("../schemas/notification.schema").Notification, {}, {}> & import("../schemas/notification.schema").Notification & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    unread(req: any): Promise<{
        count: number;
    }>;
    markRead(id: string, req: any): Promise<import("mongoose").Document<unknown, {}, import("../schemas/notification.schema").Notification, {}, {}> & import("../schemas/notification.schema").Notification & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    markAllRead(req: any): Promise<{
        ok: boolean;
    }>;
}
