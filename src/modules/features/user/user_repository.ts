import { AbstractRepository, EntityRepository } from "typeorm";
import { UserEntity } from "./entity/UserEntity";
import { Service } from "typedi";

@Service()
@EntityRepository(UserEntity)
export class UserRepository extends AbstractRepository<UserEntity> {
  createAndSave(requestUser: UserEntity): Promise<UserEntity> {
    return this.manager.save(requestUser);
  }

  findById(id: string): Promise<UserEntity> {
    return this.repository.findOne({ id });
  }

  findByEmail(email: string): Promise<UserEntity> {
    return this.repository.findOne({ email });
  }
}
