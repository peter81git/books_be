/* eslint-disable prettier/prettier */
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Request } from "../../requests/entities/request.entity";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name:string;

  @Column()
  email:string;

  @CreateDateColumn()
  insertdate:Date;

  @UpdateDateColumn()
  modifydate:Date;


  @Column({ default: false })
  status: boolean;

  @OneToMany(()=>Request,req=>req.user)
  requests:Request[]

}
