import { Controller, Get, Post, Body, Patch, Param, Delete, Query, DefaultValuePipe, ParseIntPipe } from "@nestjs/common";
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Pagination } from "nestjs-typeorm-paginate";
import { Book } from "./entities/book.entity";

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post()
  create(@Body() createBookDto: CreateBookDto) {
    return this.booksService.create(createBookDto);
  }

  @Get('/all')
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,):Promise<Pagination<Book>> {
    limit = limit > 100 ? 100 : limit;
    return this.booksService.findAll({page,limit});
  }

  @Get('/filter')
  findByIsbn(@Query() queryParams) {
    return this.booksService.findByIsbn(queryParams.isbn);
  }

  @Get('/restore/:id')
  restoreBook(@Param('id') id: string) {
    return this.booksService.restore(+id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.booksService.findOne(+id);
  }



  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto) {
    return this.booksService.update(+id, updateBookDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.booksService.remove(+id);
  }
}
