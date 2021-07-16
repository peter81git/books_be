import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Book } from '../../books/entities/book.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Request {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Book, (book) => book.requests)
  //@JoinColumn({ name: 'book_id' })
  book: Book;

  @ManyToOne(() => User, (user) => user.requests)
  //@JoinColumn({ name: 'user_id' })
  user: User;

  // @Column()
  // userid: number;

  @Column({ default: null })
  returndate: Date;

  @CreateDateColumn()
  createdate: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  // @Column()
  // bookid: number;

  //@Column()
  user_id: number;
  //@Column()
  book_id: number;
}
