import {
  Middleware,
  ExpressErrorMiddlewareInterface,
  HttpError,
} from "routing-controllers";
import { KHttpException } from "./k_http_exception";
import { QueryFailedError } from "typeorm";

@Middleware({ type: "after" })
export class CustomErrorHandler implements ExpressErrorMiddlewareInterface {
  error(error: any, request: any, response: any, next: (err: any) => any) {
    if (error instanceof HttpError) {
      if (error instanceof KHttpException) {
        response.status(error.httpCode ?? 500).json({
          error: error.errors.join(","),
        });
      } else {
        response.status(error.httpCode ?? 500).json(error);
      }
    } else if (error instanceof QueryFailedError) {
      response.status(400).json({
        error: error.message,
        name: error.name,
      });
    } else {
      response.status(error.httpCode ?? 500).json({
        error: error.toString(),
      });
    }
  }
}
