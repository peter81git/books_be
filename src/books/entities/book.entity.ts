/* eslint-disable prettier/prettier */
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { Request } from "../../requests/entities/request.entity";

@Entity()
export class Book {
  @PrimaryGeneratedColumn()
  id:number;

  @Column()
  title:string;

  @Column({type:'varchar', length:4,default:''})
  year?:string;

  @Column()
  isbn:string;

  @Column({default:''})
  isbn13:string;

  @Column({ default: false })
  isReserved: boolean;

  @CreateDateColumn()
  insertdate:Date;

  @UpdateDateColumn()
  modifydate:Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @OneToMany(()=>Request,req=>req.book)
  requests:Request[]
}
