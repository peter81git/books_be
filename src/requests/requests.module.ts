import { Module } from '@nestjs/common';
import { RequestsService } from './requests.service';
import { RequestsController } from './requests.controller';
import { TypeOrmModule } from "@nestjs/typeorm";
import { Request } from "./entities/request.entity";
import { BookRepository } from "../books/repository/book.repository";
import { User } from "../users/entities/user.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Request,BookRepository,User])],
  controllers: [RequestsController],
  providers: [RequestsService],
})
export class RequestsModule {}
