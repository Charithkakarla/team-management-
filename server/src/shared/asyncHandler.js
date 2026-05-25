// Async helper: forwards rejected route handlers to Express error middleware.
// It removes repetitive try/catch code from controllers.
// Use this file to understand async route wrapping.
export const asyncHandler = (handler) => (req, res, next) => {
  Promise.resolve(handler(req, res, next)).catch(next);
};
