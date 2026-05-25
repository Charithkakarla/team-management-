export const notFound = (req, res, next) => {
  res.status(404);
  next(new Error(`Not found - ${req.originalUrl}`));
};

export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || res.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    message,
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack
  });
};
