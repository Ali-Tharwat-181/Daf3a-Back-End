export default function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const isDev = process.env.NODE_ENV === "development";

  if (isDev) {
    console.error("Error:", err);
  }

  const response = {
    success: false,
    message: err.message || "Internal Server Error",
  };

  if (isDev) {
    response.stack = err.stack;
    response.error = err;
  }

  res.status(statusCode).json(response);
}
