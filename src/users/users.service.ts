import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './entities/user.entity.js';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({
      where: { email },
    });
  }

  async findById(id: number): Promise<User | null> {
    return this.userModel.findByPk(id);
  }

  async createUser(data: {
    nom: string;
    email: string;
    password: string;
    role?: 'CLIENT' | 'ADMIN';
  }): Promise<User> {
    return this.userModel.create({
      nom: data.nom,
      email: data.email,
      password: data.password,
      role: data.role ?? 'CLIENT',
    });
  }
}