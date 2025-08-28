// users.controller.ts
import { Controller, Get, Param, UseGuards, Post, Req, Patch, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../../common/jwt.guard';
import { CloudinaryService } from './cloudinary.service';
import { JwtService } from '@nestjs/jwt';

@Controller('users')
export class UsersController {
  constructor(
    private users: UsersService,
    private cloudinary: CloudinaryService,
    private jwt: JwtService
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@Req() req) {
    const user = await this.users.findById(req.user.sub);
    return this.users.publicProfile(user, req.user.sub);
  }

  @Get(':id')
  async get(@Req() req, @Param('id') id: string) {
    // optional JWT (so profiles work for logged-out users too)
    let currentUserId: string | undefined;
    const auth = req.headers?.authorization;
    if (auth?.startsWith('Bearer ')) {
      try {
        const payload: any = this.jwt.verify(auth.slice(7));
        currentUserId = payload?.sub;
      } catch {}
    }
    const user = await this.users.findById(id);
    return this.users.publicProfile(user, currentUserId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  async updateMe(@Req() req, @Body() body: { bio?: string; profilePic?: string }) {
    let url = undefined;
    if (body.profilePic) url = await this.cloudinary.uploadImage(body.profilePic);
    return this.users.updateProfile(req.user.sub, { bio: body.bio, profilePic: url });
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/follow')
  async follow(@Req() req, @Param('id') id: string) {
    return this.users.follow(req.user.sub, id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/unfollow')
  async unfollow(@Req() req, @Param('id') id: string) {
    return this.users.unfollow(req.user.sub, id);
  }
}
