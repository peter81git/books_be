import { Injectable } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { InjectRepository } from "@nestjs/typeorm";
import { Book } from "./entities/book.entity";
import { Repository } from "typeorm";
import { BookRepository } from "./repository/book.repository";
import { IPaginationOptions, paginate, Pagination } from "nestjs-typeorm-paginate";

@Injectable()
export class BooksService {

  constructor(@InjectRepository(Book) private bookRepository: BookRepository /*Repository<Book>*/) {
  }
  create(createBookDto: CreateBookDto) {
    const newBook = this.bookRepository.create(createBookDto);
    return this.bookRepository.save(newBook);
  }

  async findAll(options: IPaginationOptions): Promise<Pagination<Book>> {
    return paginate(this.bookRepository, options);
    //return this.bookRepository.find();
  }

  findOne(id: number) {
    return this.bookRepository.findOne(id);
  }

  findByIsbn(isbn: string) {
    return this.bookRepository.findByIsbn(isbn);
  }

  async update(id: number, updateBookDto: UpdateBookDto) {
    const book = await this.findOne(id);

    book.title = updateBookDto?.title;
    book.year = updateBookDto?.year;
    return this.bookRepository.save(book);
  }

  async remove(id: number) {
    //const book = await this.findOne(id);
    //book.isActive = false;
    return this.bookRepository.softDelete(id);
  }

  restore(id: number) {
    return this.bookRepository.restore(id);
  }

}
