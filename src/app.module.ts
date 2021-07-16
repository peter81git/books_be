import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BooksModule } from './books/books.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SqliteConnectionOptions } from "typeorm/driver/sqlite/SqliteConnectionOptions";
import { Book } from "./books/entities/book.entity";
import { Request } from "./requests/entities/request.entity";
import { RequestsModule } from './requests/requests.module';
import { UsersModule } from './users/users.module';
import { User } from "./users/entities/user.entity";

const config: SqliteConnectionOptions = {
  type: 'sqlite',
  database: 'dbSqlite/db',
  entities:[Book,Request,User],
  synchronize:true
};

@Module({
  imports: [BooksModule, TypeOrmModule.forRoot(config), RequestsModule, UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
