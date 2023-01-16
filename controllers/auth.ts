import { CookieOptions, NextFunction, Request, Response } from 'express';
import { Types } from 'mongoose';

import asyncHandler from '../middleware/asyncHandler.js';
import { CustomRequest } from '../middleware/auth.js';
import { User, UserMethods, userModel } from '../model/User.js';
import ErrorResponse from '../utils/errorResponse.js';

interface UserRegistration {
  name: string;
  email: string;
  password: string;
  aboutMe?: string;
  avatar: string;
}

type UserType = User & {
  _id: Types.ObjectId;
} & UserMethods;

export interface NewCustomRequest extends CustomRequest {
  user: {
    id: string;
    _id?: Types.ObjectId;
  };
}

/**
 * @desc Sign up User
 * @route POST /api/v1/auth/register
 * @access Public
 */
export const register = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const reqBody: UserRegistration = req.body;
    // Creating User
    const newUser = await userModel.create(reqBody);
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
    const user = await userModel
      .findOne({ email: reqBody.email })
      .select("+password");
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
 * @desc Get current logged in user
 * @route GET /api/v1/auth/me
 * @access Private
 */
export const me = asyncHandler(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    res.status(200).json({ success: true, data: req.user });
  }
);

/**
 * @desc  Update user details
 * @route PUT /api/v1/auth/uptdetails
 * @access Private
 */
export const updateDetails = asyncHandler(
  async (req: NewCustomRequest, res: Response, next: NextFunction) => {
    const fields: Partial<{ name: string; email: string }> = {
      name: req.body.name,
      email: req.body.email,
    };

    const user = await userModel.findByIdAndUpdate(req.user.id, fields, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, data: user });
  }
);

/**
 * @desc  Update user password
 * @route PUT /api/v1/auth/uptpassword
 * @access Private
 */
export const updatePassword = asyncHandler(
  async (req: NewCustomRequest, res: Response, next: NextFunction) => {
    interface UpdatePassword {
      currentPassword: string;
      newPassword: string;
    }
    const reqBody: UpdatePassword = {
      currentPassword: req.body.currentPassword,
      newPassword: req.body.newPassword,
    };

    const user = await userModel.findById(req.user.id).select("+password");

    // Check current password
    const isMatch: boolean | undefined = await user?.matchPassword(
      reqBody.currentPassword
    );
    if (!isMatch) {
      return next(new ErrorResponse("Password is incorrect.", 401));
    }

    // if user is not null
    if (user) {
      user.password = reqBody.newPassword;
      await user.save();
      createAndSendToken(user, res, 200);
    }
  }
);

/**
 * Create token
 * Put token into cookie
 * token expires in 30d
 * @param (user, res, statusCode)
 */
interface ICookieOptions extends CookieOptions {
  expires: Date;
  httpOnly?: boolean;
  secure?: boolean;
  origin: string;
}
function createAndSendToken(
  user: User & Required<{ _id: string | Types.ObjectId }> & UserMethods,
  res: Response,
  statusCode: number
) {
  const token: string = user.getSignJwToken();

  if (typeof process.env.JWT_COOKIE_EXPIRE === "string") {
    const expireDate = process.env.JWT_COOKIE_EXPIRE;
    let options: ICookieOptions = {
      expires: new Date(Date.now() + Number(expireDate) * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: true,
      sameSite: "none",
      origin: "http://localhost:5173",
    };
    if (process.env.NODE_ENV === "production") {
      options.secure = true;
    }
    res.status(statusCode).cookie("token", token, options).json({
      token,
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
    });
  }
}
