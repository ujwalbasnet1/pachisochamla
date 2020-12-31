import "reflect-metadata";
import {
  Connection,
  createConnection,
  getCustomRepository,
  useContainer as typeormUserContainer,
} from "typeorm";
import { Container } from "typedi";
import {
  Action,
  createExpressServer,
  HttpError,
  UnauthorizedError,
  useContainer as routingUseContainer,
} from "routing-controllers";
import { UserController } from "./modules/controllers/UserController";
import { CustomErrorHandler } from "./error_handler";
import { UserRepository } from "./modules/features/user/user_repository";

import * as jwt from "jwt-then";
import { NoteController } from "./modules/controllers/NoteController";

typeormUserContainer(Container);
createConnection().then((conn: Connection) => {});

// its important to set container before any operation you do with routing-controllers,
// including importing controllers
routingUseContainer(Container);

// create and run server
createExpressServer({
  controllers: [UserController, NoteController],
  defaultErrorHandler: false,
  middlewares: [CustomErrorHandler],
  authorizationChecker: async (action: Action, roles: string[]) => {
    try {
      const authorization = action.request.headers.authorization;
      if (!authorization) throw new UnauthorizedError();

      const token = authorization.split(" ")[1];
      action.request.payload = await jwt.verify(
        token,
        "JWTAUTHENTICATIONSECRET"
      );

      return true;
    } catch (err) {
      if (err.name && err.name === "TokenExpiredError") {
        throw new HttpError(403, "Token Expired");
      } else {
        throw new HttpError(401, "Authorization Failed");
      }
    }
  },
  currentUserChecker: async (action: Action) => {
    try {
      const authorization = action.request.headers.authorization;
      if (!authorization) return null;

      const token = authorization.split(" ")[1];
      const payload = await jwt.verify(token, "JWTAUTHENTICATIONSECRET");

      return await getCustomRepository(UserRepository).findById(payload.id);
    } catch (err) {
      return null;
    }
  },
  // interceptors: [__dirname + '/interceptors/*.js'],
}).listen(3000, () => {
  console.log("Server started at http://localhost:3000");
});
