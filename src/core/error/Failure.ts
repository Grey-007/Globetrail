export abstract class Failure {
  constructor(public readonly message: string) {}
}

export class DatabaseFailure extends Failure {
  constructor(message: string = 'A database error occurred') {
    super(message);
  }
}
