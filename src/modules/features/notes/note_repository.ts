import { AbstractRepository, EntityRepository } from "typeorm";
import { Service } from "typedi";
import { NoteEntity } from "./entity/NoteEntity";
import { UserEntity } from "../user/entity/UserEntity";
import { NotFoundError } from "routing-controllers";

@Service()
@EntityRepository(NoteEntity)
export class NoteRepository extends AbstractRepository<NoteEntity> {
  addNote(note: NoteEntity) {
    return this.repository.save(note);
  }

  findNoteById(id: string) {
    return this.repository.findOne({ id });
  }

  async addSharedUsers(note: NoteEntity, users) {
    if (!note) throw new NotFoundError("Related note not found");

    note.sharedUsers = Promise.resolve(
      users.map((element) => {
        const x = new UserEntity();
        x.id = element;
        return x;
      })
    );

    return await this.repository.save(note);
  }

  updateNote(id: string, title: string, description: string) {
    return this.repository.update(id, { title, description });
  }

  deleteNote(id: string) {
    return this.repository.delete(id);
  }
}
