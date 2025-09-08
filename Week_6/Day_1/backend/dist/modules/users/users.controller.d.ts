import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { Request } from 'express';
import { Role } from '../../schemas/user.schema';
declare module 'express' {
    interface Request {
        user?: any;
    }
}
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getProfile(req: Request): Promise<import("../../schemas/user.schema").UserDocument>;
    updateProfile(req: Request, dto: UpdateUserDto): Promise<import("../../schemas/user.schema").UserDocument>;
    getAllUsers(): Promise<import("../../schemas/user.schema").UserDocument[]>;
    updateRole(id: string, role: Role): Promise<import("mongoose").Document<unknown, {}, import("../../schemas/user.schema").UserDocument> & import("../../schemas/user.schema").User & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    toggleBlock(id: string, block: boolean): Promise<import("mongoose").Document<unknown, {}, import("../../schemas/user.schema").UserDocument> & import("../../schemas/user.schema").User & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }>;
}
