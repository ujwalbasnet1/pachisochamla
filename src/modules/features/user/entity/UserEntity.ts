import {
  BeforeInsert,
  Column,
  Entity,
  Generated,
  ManyToMany,
  OneToMany,
  PrimaryColumn,
  Unique,
} from "typeorm";
import { IsEmail, Min, MinLength } from "class-validator";

import hashPassword from "../../../../utils/hashPassword";
import { NoteEntity } from "../../notes/entity/NoteEntity";

@Unique(["email"])
@Entity("user")
export class UserEntity {
  @PrimaryColumn()
  @Generated("uuid")
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  age: number;

  @Column()
  @IsEmail()
  email: string;

  @Column({ select: false })
  @MinLength(6)
  password: string;

  @OneToMany(() => NoteEntity, (note) => note.user)
  notes: Promise<Array<NoteEntity>>;

  @ManyToMany(() => NoteEntity, (note) => note.sharedUsers)
  sharedNotes: Promise<Array<NoteEntity>>;

  @BeforeInsert()
  hashPasswordBefore() {
    this.password = hashPassword(this.password);
  }
}
