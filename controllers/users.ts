import { NextFunction, Response } from 'express';

import asyncHandler from '../middleware/asyncHandler.js';
import { userModel } from '../model/User.js';
import { NewCustomRequest } from './auth.js';

/**
 * @desc Get Users
 * @route Get /api/v1/user/search?
 * @access Public
 */

export const getUsers = asyncHandler(
  async (req: NewCustomRequest, res: Response, next: NextFunction) => {
    const query = req.query.search
      ? {
          $or: [
            { name: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } },
          ],
        }
      : {};

    const users = await userModel
      .find(query)
      .find({ _id: { $ne: req.user.id } });
    res.status(200).json({ users });
  }
);
