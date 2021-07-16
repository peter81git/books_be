/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { InjectRepository } from "@nestjs/typeorm";
import { Request } from "./entities/request.entity";
import { getRepository, Repository } from 'typeorm';
import { Book } from "../books/entities/book.entity";
import { BookRepository } from "../books/repository/book.repository";
import { User } from "../users/entities/user.entity";
import { IPaginationOptions, paginate, Pagination } from "nestjs-typeorm-paginate";

@Injectable()
export class RequestsService {

  constructor(@InjectRepository(Request) private reqRepository: Repository<Request>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Book) private bookRepository: BookRepository) {
  }

  async create(createRequestDto: CreateRequestDto) {

    const requestedBook = await this.bookRepository.findOne(createRequestDto.book_id);
    const userOnRequest = await this.userRepository.findOne(createRequestDto.user_id);

    if (!userOnRequest.status) {
      throw new HttpException('User not active', HttpStatus.BAD_REQUEST);
    }
    if (requestedBook.isReserved) {
      throw new HttpException('Book reserved', HttpStatus.BAD_REQUEST);
    }


    if (requestedBook && userOnRequest) {
      const newReq = this.reqRepository.create(createRequestDto);
      newReq.user = userOnRequest;
      newReq.book = requestedBook;

      requestedBook.isReserved = true;
      this.bookRepository.save(requestedBook);

      const result = await this.reqRepository.save(newReq);

      return {
        'createdate': result.createdate,
        'id': result.id,
        'returndate': result.returndate,
        'requestUserName': result.user.name,
        'requestUser': result.user.id,
        'requestUserEmail': result.user.email,
        'requestBookName': result.book.title,
        'requestBook': result.book.id

      }

    }
    throw new HttpException('Book/User Unknown', HttpStatus.BAD_REQUEST);

  }

  async findAll(options: IPaginationOptions): Promise<Pagination<Request>> {
    const allReqBooks = await getRepository(Request).createQueryBuilder("request")
      .where('request.returndate ISNULL')
      .innerJoin('request.book', 'book').innerJoin('request.user', 'reqUser')
      .select(['reqUser.email', "request.id", "request.returndate", "request.createdate", "book.title", "book.isReserved"]);
    return paginate(allReqBooks, options)
  }

  findOne(id: number) {
    return this.reqRepository.findOne(id)
    //return `This action returns a #${id} request`;
  }

  async update(id: number, updateRequestDto: UpdateRequestDto) {
    const request = await this.findOne(id);

    request.returndate = updateRequestDto?.returndate;

    return this.reqRepository.save(request);
  }

  async remove(id: number) {
    const request = await this.reqRepository.findOne(id)

    const { bookid } = await getRepository(Request).createQueryBuilder("request")
      .select("request.bookId", 'bookid')
      .where("request.id = :bookid", { bookid: id })
      .getRawOne();

    const requestedBook = await this.bookRepository.findOne(bookid);

    requestedBook.isReserved = false;

    //TODO: Use transaction
    this.bookRepository.save(requestedBook);

    request.returndate = new Date();
    this.reqRepository.save(request);

    //return this.reqRepository.softDelete(id);
    return { resp: `Book returned` };
  }

  async requestsBooksByUser(userid: number) {
    //const user = await this.userRepository.findOne(userid);
    const userReqBooks = await getRepository(Request).createQueryBuilder("request").innerJoin('request.book', 'book')
      .select(["request.returndate", "request.createdate", "book.title", "book.isReserved"])
      .where('request.userId=:userID', { userID: userid })
      .getMany();
    //console.log(userReqBooks);

    //.where("user.id = :id", { id: 1 })
    return userReqBooks
  }
}
