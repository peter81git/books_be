import { Module } from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { TypeOrmModule } from "@nestjs/typeorm";
//import { Book } from "./entities/book.entity";
import { BookRepository } from "./repository/book.repository";

@Module({
  imports: [TypeOrmModule.forFeature([BookRepository])],
  controllers: [BooksController],
  providers: [BooksService],
})
export class BooksModule {}
