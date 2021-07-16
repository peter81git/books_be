import { EntityRepository, Repository } from "typeorm";
import { Book } from "../entities/book.entity";

@EntityRepository(Book)
export class BookRepository extends Repository<Book>{
  findByIsbn(isbn: string) {
    //return '1234567890987654321';
    return this.findOne({ 'isbn':isbn });
  }
}
