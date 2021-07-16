import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";

import { BookRepository } from '../books/repository/book.repository';
import { Request } from '../requests/entities/request.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Request, User, BookRepository])],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule { }
