import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import { UsersModule } from '../users/users.module.js';

@Module({
  imports: [
    UsersModule,

    JwtModule.registerAsync({
      imports: [],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: '1d',
        },
      }),
    }),
  ],

  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}