// App error helper: wraps API errors with HTTP status codes.
// It makes thrown errors easier to handle in one format.
// Use this file to understand custom server errors.
export class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
  }
}
