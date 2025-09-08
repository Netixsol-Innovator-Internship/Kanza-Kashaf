import { Controller, Get, Patch, Body, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { UpdateUserDto } from './dto/update-user.dto';
import { Request } from 'express';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/guards/roles.decorator';
import { Role } from '../../schemas/user.schema';
import { ForbiddenException } from '@nestjs/common';
import { Param } from '@nestjs/common';

declare module 'express' {
  interface Request {
    user?: any;
  }
}

@ApiTags('users')
@ApiBearerAuth('jwt')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async getProfile(@Req() req: Request) {
    return this.usersService.findById(req.user.userId);
  }

  @Patch('me')
  @ApiBody({ type: UpdateUserDto })
  async updateProfile(@Req() req: Request, @Body() dto: UpdateUserDto) {
    return this.usersService.updateProfile(req.user.userId, dto);
  }

  @Get()
  @Roles(Role.SUPER_ADMIN)
  async getAllUsers() {
    return this.usersService.findAll();
  }

  @Patch(':id/role')
  @Roles(Role.SUPER_ADMIN)
  async updateRole(@Param('id') id: string, @Body('role') role: Role) {
    const user = await this.usersService.findByIdRaw(id);
    if (user.blocked) throw new ForbiddenException("Cannot change role of blocked user");
    return this.usersService.updateRole(id, role);
  }

  @Patch(':id/block')
  @Roles(Role.SUPER_ADMIN)
  async toggleBlock(@Param('id') id: string, @Body('block') block: boolean) {
    return this.usersService.toggleBlock(id, block);
  }
}
