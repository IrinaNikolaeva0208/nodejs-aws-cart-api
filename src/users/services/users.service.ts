import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../models';
import { UserEntity } from '../entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  findOne(name: string): Promise<UserEntity | null> {
    return this.userRepository.findOne({ where: { name } });
  }

  createOne({ name, email }: User): Promise<UserEntity> {
    const user = this.userRepository.create({
      name,
      email: email ?? `${name}@example.com`,
    });

    return this.userRepository.save(user);
  }
}
