import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';
import { UserDocument } from '../../../schemas/user.schema';
declare const JwtStrategy_base: new (...args: any[]) => any;
export declare class JwtStrategy extends JwtStrategy_base {
    private userModel;
    constructor(config: ConfigService, userModel: Model<UserDocument>);
    validate(payload: any): Promise<{
        userId: any;
        email: string;
        role: import("../../../schemas/user.schema").Role;
    }>;
}
export {};
