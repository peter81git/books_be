import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { Repository } from "typeorm";
import { Book } from 'src/books/entities/book.entity';
import { BookRepository } from 'src/books/repository/book.repository';
import { getRepository } from 'typeorm';
import { Request } from 'src/requests/entities/request.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Book) private bookRepository: BookRepository,
    @InjectRepository(Request) private reqRepository: Repository<Request>,
  ) { }

  create(createUserDto: CreateUserDto) {
    const newuser = this.userRepository.create(createUserDto);
    newuser.status = true;
    return this.userRepository.save(newuser);
    //return 'This action adds a new user';
  }

  findAll() {
    return this.userRepository.find();
    //return `This action returns all users`;
  }

  findOne(id: number) {
    return this.userRepository.findOne(id);
    //return `This action returns a #${id} user`;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne(id);
    user.status = updateUserDto?.status;


    const booksid = await getRepository(Request)
      .createQueryBuilder('request')
      .select('request.bookId', 'bookid')
      .addSelect('request.userId', 'userid')
      .where('request.userId = :user', { user: id })
      .andWhere('request.returndate IS NULL')
      .getRawMany();

    booksid.forEach(async (book) => {
      const requestedBook = await this.bookRepository.findOne(book.bookid);
      requestedBook.isReserved = false;
      this.bookRepository.save(requestedBook);

      const request = await this.reqRepository.findOne(book.userid);
      request.returndate = new Date();
      this.reqRepository.save(request);
    });

    return this.userRepository.save(user);
    //return`This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
