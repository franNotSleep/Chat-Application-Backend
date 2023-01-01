import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { UserModel } from '../model/User.js';
import ErrorResponse from '../utils/errorResponse.js';
import asyncHandler from './asyncHandler.js';

interface CustomRequest extends Request {
  user: object | null;
}

// Protect routes
export const protect = asyncHandler(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    let token: string = "";

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      // ['Bearer', token]
      //    0        1
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies.token) {
      token = req.cookies.token;
    }

    // Check token
    if (!token) {
      return next(new ErrorResponse("Not Authorized", 401));
    }

    // Verify token
    try {
      if (typeof process.env.JWT_SECRET === "string") {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const objectId = decoded.id;
        const user = UserModel.findById(decoded.id);
        next();
      }
    } catch (error) {
      return next(new ErrorResponse("Not Authorized", 401));
    }
  }
);
