import {
  Authorized,
  BadRequestError,
  Body,
  Delete,
  JsonController,
  NotFoundError,
  Param,
  Patch,
  Post,
  Req,
} from "routing-controllers";
import { InjectRepository } from "typeorm-typedi-extensions";
import { NoteEntity } from "../features/notes/entity/NoteEntity";
import { NoteRepository } from "../features/notes/note_repository";
import { UserEntity } from "../features/user/entity/UserEntity";

@Authorized()
@JsonController("/notes")
export class NoteController {
  constructor(
    @InjectRepository()
    private readonly noteRepository: NoteRepository
  ) {}

  @Post("/")
  addNote(@Req() req, @Body() note: NoteEntity) {
    const user = new UserEntity();
    user.id = req.payload.id;
    note.user = Promise.resolve(user);
    return this.noteRepository.addNote(note);
  }

  @Patch("/:id")
  async updateNote(
    @Req() req,
    @Body() note: NoteEntity,
    @Param("id") id: string
  ) {
    const retrieved = await this.noteRepository.findNoteById(id);

    if (!retrieved) throw new BadRequestError("Note not found");
    if ((await retrieved.user).id !== req.payload.id)
      throw new BadRequestError("You don't own this note");

    return this.noteRepository.updateNote(
      id,
      note.title ?? retrieved.title,
      note.description ?? retrieved.description
    );
  }

  @Delete("/:id")
  async deleteNote(
    @Req() req,
    @Body() note: NoteEntity,
    @Param("id") id: string
  ) {
    const retrieved = await this.noteRepository.findNoteById(id);

    if (!retrieved) throw new BadRequestError("Note not found");
    if ((await retrieved.user).id !== req.payload.id)
      throw new BadRequestError("You don't own this note");

    return this.noteRepository.deleteNote(id);
  }

  @Post("/share")
  async shareNote(@Req() req, @Body() body) {
    const { noteId, shareTo } = body;

    // request validation
    if (!shareTo || shareTo.length == 0)
      throw new BadRequestError(
        "User Ids to whom the note must be shared is absent"
      );

    // processing
    let note: NoteEntity = await this.noteRepository.findNoteById(noteId);

    if (!note) throw new NotFoundError("Note not found");

    if ((await note.user).id !== req.payload.id)
      throw new BadRequestError("You don't own this note");

    // output with processing
    return this.noteRepository.addSharedUsers(note, shareTo);
  }
}
