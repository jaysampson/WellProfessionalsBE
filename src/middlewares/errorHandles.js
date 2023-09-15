const { CustomAPIError } = require("../errors");
const { StatusCodes } = require("http-status-codes");
const handlerError = (err, req, res, next) => {
  if (err instanceof CustomAPIError) {
    return res.status(err.statusCode).json({ msg: err.message });
  }
  return res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .send("Something went wrong try again later");
};

const notFoundError = (req, res) =>
  res.status(404).send("Route does not exist");




// Not Found Error Hnadler

// const notFoundError = (req, res, next) => {
//   const error = new Error(`Route not found ${req.originalUrl}`);
//   res.status(404);
//   next(error);
// };

// const handlerError = (err, req, res, next) => {
//   const statuscode = res.statusCode ? res.statusCode : 500;
//   //  const statuscode = err.statusCode || 500;
//   res.status(statuscode);
//   res.json({
//     success: false,
//     status: statuscode,
//     message: err?.message,
//     stack: err?.stack,
//   });
// };

// const ErrorHandler = (err, req, res, next) => {
//   console.log("Middleware Error Hadnling");
//   const errStatus = err.statusCode || 500;
//   const errMsg = err.message || "Something went wrong";
//   res.status(errStatus).json({
//     success: false,
//     status: errStatus,
//     message: errMsg,
//     stack: process.env.NODE_ENV === "development" ? err.stack : {},
//   });
// };

module.exports = { notFoundError, handlerError };
