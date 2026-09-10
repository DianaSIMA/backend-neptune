import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { UsersService } from '../users/users.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  // Inscription
  async register(dto: RegisterDto) {
    // Vérifier si l'email existe déjà
    const existingUser = await this.usersService.findByEmail(dto.email);

    if (existingUser) {
      throw new ConflictException('Cet email est déjà utilisé');
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // Créer l'utilisateur
    const user = await this.usersService.createUser({
      nom: dto.nom,
      email: dto.email,
      password: hashedPassword,
    });

    // Ne jamais retourner le mot de passe
    return {
      message: 'Inscription réussie',
      user: {
        id: user.id,
        nom: user.nom,
        email: user.email,
        role: user.role,
      },
    };
  }

  // Connexion
  async login(dto: LoginDto) {
    // Chercher l'utilisateur par email
    const user = await this.usersService.findByEmail(dto.email);

    if (!user) {
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }

    // Vérifier le mot de passe
    const passwordValid = await bcrypt.compare(
      dto.password,
      user.password,
    );

    if (!passwordValid) {
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }

    // Informations qui seront placées dans le JWT
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    // Générer le token
    const access_token = await this.jwtService.signAsync(payload);

    return {
      message: 'Connexion réussie',
      access_token,
      user: {
        id: user.id,
        nom: user.nom,
        email: user.email,
        role: user.role,
      },
    };
  }
}