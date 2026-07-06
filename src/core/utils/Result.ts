export type Result<T, E = Error> = 
  | { success: true; data: T }
  | { success: false; error: E };

export const success = <T, E = Error>(data: T): Result<T, E> => ({ success: true, data });
export const failure = <T, E = Error>(error: E): Result<T, E> => ({ success: false, error });
