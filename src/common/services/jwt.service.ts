// import { Injectable, UnauthorizedException } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import * as jwt from 'jsonwebtoken';
// import { Token } from '../enums/token.enum';

// interface JwtPayload {
//   sub: string;
//   email: string;
//   role: string;
//   purpose: Token;
// }

// @Injectable()
// export class JwtService {
//   private readonly secret: string;

//   constructor(private readonly configService: ConfigService) {
//     this.secret =
//       this.configService.get<string>('JWT_SECRET') || 'default_secret_key';
//   }

//   async createToken(
//     payload: JwtPayload,
//     expiresIn: string = '1h',
//   ): Promise<string> {
//     return jwt.sign(payload, this.secret, { expiresIn });
//   }

//   async verifyToken(token: string): Promise<JwtPayload> {
//     try {
//       return jwt.verify(token, this.secret) as JwtPayload;
//     } catch (error) {
//       throw new UnauthorizedException('Invalid or expired token');
//     }
//   }

//   decodeToken(token: string): JwtPayload | null {
//     return jwt.decode(token) as JwtPayload | null;
//   }
// }

// import { Injectable } from '@nestjs/common';
// import { PassportStrategy } from '@nestjs/passport';
// import { ExtractJwt, Strategy } from 'passport-jwt';
// import { ConfigService } from '@nestjs/config';
// import { AuthService } from './auth.service';
// import { UserResponseDto } from '../users/dto/user-response.dto';

// interface JwtPayload {
//   sub: string;
//   email: string;
//   role: string;
// }

// @Injectable()
// export class JwtStrategy extends PassportStrategy(Strategy) {
//   constructor(
//     private readonly authService: AuthService,
//     private readonly configService: ConfigService,
//   ) {
//     super({
//       jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//       ignoreExpiration: false,
//       secretOrKey: configService.get<string>('JWT_SECRET') || 'your-secret-key',
//     });
//   }

//   async validate(payload: JwtPayload): Promise<UserResponseDto> {
//     return await this.authService.validateUserById(payload.sub);
//   }
// }
