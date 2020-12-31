import { HttpError } from "routing-controllers";

export class KHttpException extends HttpError {
  errors: Array<string>;
  code: number;

  constructor(errors: Array<string>, code?: number) {
    super(code);
    this.errors = errors;
  }
}
