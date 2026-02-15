import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';
import { ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { TransformInterceptor } from '../../interceptors/transform.interceptor';
import { UserDto } from './dto/user.dto';
import { AccessGuard } from '../../security/jwt/access/access.guard';
import { AdminGuard } from '../../security/jwt/roles/admin.guard';
import { AdminOrMeGuard } from '../../security/jwt/roles/admin-or-me.guard';

@ApiTags('users')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get(':id')
  @UseGuards(AccessGuard, AdminGuard)
  @UseInterceptors(new TransformInterceptor(UserDto))
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({ name: 'id', description: 'User ID', type: String })
  async getById(@Param('id') id: string) {
    return await this.userService.getById(id);
  }
  @Get()
  @UseGuards(AccessGuard, AdminGuard)
  @UseInterceptors(new TransformInterceptor(UserDto))
  @ApiOperation({ summary: 'Get all users' })
  async getAll() {
    return await this.userService.getAll();
  }

  @Put(':id')
  @UseGuards(AccessGuard, AdminOrMeGuard)
  @UseInterceptors(new TransformInterceptor(UserDto))
  @ApiOperation({ summary: 'Update user by ID' })
  @ApiParam({ name: 'id', description: 'User ID', type: String })
  @ApiBody({ type: CreateUserDto })
  async update(@Param('id') id: string, @Body() body: CreateUserDto) {
    return this.userService.updateById(id, body);
  }

  @Delete(':id')
  @UseGuards(AccessGuard, AdminOrMeGuard)
  @UseInterceptors(new TransformInterceptor(UserDto))
  @ApiOperation({ summary: 'Delete user by ID' })
  @ApiParam({ name: 'id', description: 'User ID', type: String })
  async delete(@Param('id') id: string) {
    return this.userService.deleteById(id);
  }
}
