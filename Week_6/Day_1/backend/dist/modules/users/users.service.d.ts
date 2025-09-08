import { Model } from 'mongoose';
import { Role, User, UserDocument } from '../../schemas/user.schema';
import { UpdateUserDto } from './dto/update-user.dto';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationsGateway } from '../notifications/notifications.gateway';
export declare class UsersService {
    private userModel;
    private notifications;
    private readonly notificationsGateway;
    constructor(userModel: Model<UserDocument>, notifications: NotificationsService, notificationsGateway: NotificationsGateway);
    findById(id: string): Promise<UserDocument>;
    updateProfile(userId: string, dto: UpdateUserDto): Promise<UserDocument>;
    findAll(): Promise<UserDocument[]>;
    findByIdRaw(id: string): Promise<import("mongoose").Document<unknown, {}, UserDocument> & User & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    updateRole(id: string, role: Role): Promise<import("mongoose").Document<unknown, {}, UserDocument> & User & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    toggleBlock(id: string, block: boolean): Promise<import("mongoose").Document<unknown, {}, UserDocument> & User & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }>;
}
