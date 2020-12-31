import {
  Column,
  Entity,
  Generated,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
} from "typeorm";
import { UserEntity } from "../../user/entity/UserEntity";

@Entity("note")
export class NoteEntity {
  @PrimaryColumn()
  @Generated("uuid")
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @ManyToOne(() => UserEntity, (user) => user.notes)
  user: Promise<UserEntity>;

  @ManyToMany(() => UserEntity, (user) => user.sharedNotes)
  @JoinTable()
  sharedUsers: Promise<Array<UserEntity>>;
}
