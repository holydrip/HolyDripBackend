import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRepository } from '../../database/repositories/user.repository';
import { UserEntity } from './user.entity';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}
  async create(data: CreateUserDto): Promise<UserEntity> {
    const saltOrRounds = 10;
    data.password = await bcrypt.hash(data.password, saltOrRounds);
    return this.userRepository.create(data);
  }
  async getById(id: string): Promise<UserEntity> {
    const user: UserEntity = await this.userRepository.findById(id);
    if (!user) throw new NotFoundException(`User with id ${id} not found`);
    return user;
  }
  async getAll(): Promise<UserEntity[]> {
    return this.userRepository.findMany();
  }
  async get(data: Prisma.UserWhereInput): Promise<UserEntity> {
    return this.userRepository.find({ where: data });
  }
  async updateById(id: string, data: CreateUserDto): Promise<UserEntity> {
    return this.userRepository.updateById(id, data);
  }
  async deleteById(id: string): Promise<UserEntity> {
    return this.userRepository.deleteById(id);
  }
}
