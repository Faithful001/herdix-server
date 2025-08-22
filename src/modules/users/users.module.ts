import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UserSchema } from './users.schema';
import { UserRepository } from './user.repository';
import { User } from './entities/user.entity';
import { JwtService } from 'src/common/services/jwt.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UsersController],
  providers: [UsersService, UserRepository, JwtService],
  exports: [UsersService, UserRepository],
})
export class UsersModule {}
