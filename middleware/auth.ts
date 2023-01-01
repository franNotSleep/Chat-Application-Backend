import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { UserModel } from '../model/User.js';
import ErrorResponse from '../utils/errorResponse.js';
import asyncHandler from './asyncHandler.js';

export interface CustomRequest extends Request {
  user: object | null;
}

interface JwtPayload {
  id: string;
}

// Protect routes
export const protect = asyncHandler(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    let token: string = "";

    if (req.cookies.token) {
      token = req.cookies.token;
    }

    // Check token
    if (!token) {
      return next(new ErrorResponse("Not Authorized", 401));
    }

    // Verify token
    try {
      if (typeof process.env.JWT_SECRET === "string") {
        const { id } = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;
        req.user = await UserModel.findById(id);
        next();
      }
    } catch (error) {
      return next(new ErrorResponse("Not Authorized", 401));
    }
  }
);
