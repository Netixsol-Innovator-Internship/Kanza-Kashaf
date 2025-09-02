import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    me(req: any): Promise<import("mongoose").Document<unknown, {}, import("../schemas/user.schema").User, {}, {}> & import("../schemas/user.schema").User & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    update(req: any, dto: UpdateUserDto): Promise<import("mongoose").Document<unknown, {}, import("../schemas/user.schema").User, {}, {}> & import("../schemas/user.schema").User & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
}
