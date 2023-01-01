import { NextFunction, Request, Response } from 'express';

import ErrorResponse, { IErrorResponse } from '../utils/errorResponse.js';

const errorHandler = (
  err: IErrorResponse,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let error: IErrorResponse = { ...err };

  error.message = err.message;

  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    error = new ErrorResponse(`Resource Not Found.`, 404);
  }

  // Mongoose Validation Error
  if (err.name === "ValidationError") {
    if (typeof err.errors === "object") {
      const errMsg = Object.values(err.errors).map(
        (val: { message: string }): string => val.message
      );
      error = new ErrorResponse(errMsg, 400);
    }
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    error = new ErrorResponse("Duplicate field", 400);
  }
  res
    .status(error.statusCode ?? 500)
    .json({ success: false, error: error.message || "Server Error" });
};

export default errorHandler;
