import {
  Authorized,
  Body,
  CurrentUser,
  Get,
  JsonController,
  Post,
  Req,
} from "routing-controllers";
import { InjectRepository } from "typeorm-typedi-extensions";
import { UserRepository } from "../features/user/user_repository";
import { UserEntity } from "../features/user/entity/UserEntity";
import { LoginRequest } from "../models/request_interfaces/login_request";

import * as jwt from "jwt-then";

import hashPassword from "../../utils/hashPassword";

@JsonController("/users")
export class UserController {
  constructor(
    @InjectRepository()
    private readonly userRepository: UserRepository
  ) {}

  @Post("/signup")
  signup(@Body() user: UserEntity) {
    return this.userRepository.createAndSave(user);
  }

  @Post("/login")
  async login(@Body() request: LoginRequest) {
    const user = await this.userRepository.findByEmail(request.email);

    if (!user) throw "No account was found associated to that email.";

    if (user.password !== hashPassword(request.password))
      throw "Email and password did not match.";

    // TODO
    const token = await jwt.sign({ id: user.id }, "JWTAUTHENTICATIONSECRET");

    return { message: "Logged in successfully.", token };
  }

  @Authorized()
  @Get("/notes")
  async getMyNotes(@Req() req, @CurrentUser() user) {
    return { notes: await user.notes, shared: await user.sharedNotes };
  }
}
