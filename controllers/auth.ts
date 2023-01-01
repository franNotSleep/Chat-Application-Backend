import { NextFunction, Request, Response } from 'express';
import { Types } from 'mongoose';

import asyncHandler from '../middleware/asyncHandler.js';
import { User, UserMethods, UserModel } from '../model/User.js';
import ErrorResponse from '../utils/errorResponse.js';

interface UserRegistration {
  name: string;
  email: string;
  password: string;
  aboutMe?: string;
}

type UserType = User & {
  _id: Types.ObjectId;
} & UserMethods;

/**
 * @desc Sign up User
 * @route POST /api/v1/auth/register
 * @access Public
 */
export const register = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const reqBody: UserRegistration = req.body;
    // Creating User
    const newUser = await UserModel.create(reqBody);
    createAndSendToken(newUser, res, 200);
  }
);

/**
 * @desc Log in User
 * @route POST /api/v1/auth/login
 * @access Public
 */
export const login = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const reqBody: { email: string; password: string } = req.body;
    // Validate email & password
    if (!reqBody.email || !reqBody.password) {
      return next(
        new ErrorResponse("Please provide an email and password", 400)
      );
    }

    // Check if user exist and password is correct
    const user = await UserModel.findOne({ email: reqBody.email }).select(
      "+password"
    );
    if (!user) {
      return next(new ErrorResponse("Invalid Credentials", 401));
    }

    // Check password
    const matchPassword: boolean = await user.matchPassword(reqBody.password);
    if (!matchPassword) {
      return next(new ErrorResponse("Invalid Credentials", 401));
    }

    createAndSendToken(user, res, 200);
  }
);

/**
 * @desc Log user out & clear cookie
 * @route GET /api/v1/auth/logout
 * @access Private
 */
export const logout = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    res.cookie("token", "none", {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true,
    });
    res.status(200).json({ success: true });
  }
);

/**
 * @desc Log user out & clear cookie
 * @route GET /api/v1/auth/logout
 * @access Private
 */
export const me = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({ hola: "hola" });
  }
);

/**
 * Create token
 * Put token into cookie
 * token expires in 30d
 * @param (user, res, statusCode)
 */
function createAndSendToken(user: UserType, res: Response, statusCode: number) {
  const token: string = user.getSignJwToken();

  if (typeof process.env.JWT_COOKIE_EXPIRE === "string") {
    const expireDate = process.env.JWT_COOKIE_EXPIRE;
    let options: { expires: Date; httpOnly: boolean; secure?: boolean } = {
      expires: new Date(Date.now() + Number(expireDate) * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };
    if (process.env.NODE_ENV === "production") {
      options.secure = true;
    }
    res.status(statusCode).cookie("token", token, options).json({ token });
  }
}
