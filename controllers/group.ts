import { NextFunction, Response } from 'express';

import asyncHandler from '../middleware/asyncHandler.js';
import Group, { IGroup } from '../model/Group.js';
import ErrorResponse from '../utils/errorResponse.js';
import { NewCustomRequest } from './auth.js';

/**
 * @desc Create Group
 * @route POST /api/v1/group/
 * @access Private
 */
export const createGroup = asyncHandler(
  async (req: NewCustomRequest, res: Response, next: NextFunction) => {
    const reqBody: IGroup = req.body;
    const group: IGroup = await (
      await Group.create(reqBody)
    ).populate({
      path: "admin participants",
      select: "name",
    });

    res.status(200).json(group);
  }
);

/**
 * @desc Get Groups
 * @route GET /api/v1/group?search=
 * @access Public
 */
export const getGroups = asyncHandler(
  async (req: NewCustomRequest, res: Response, next: NextFunction) => {
    const query = req.query.search
      ? {
          $or: [{ name: { $regex: req.query.search, $options: "i" } }],
        }
      : {};

    const group = await Group.find(query)
      .populate({
        path: "admin participants",
        select: "name",
      })
      .sort("-createdAt");
    res.status(200).json({ group });
  }
);

/**
 * @desc Get Groups by current user
 * @route GET /api/v1/user/group?search=
 * @access Private
 */
export const getUserGroups = asyncHandler(
  async (req: NewCustomRequest, res: Response, next: NextFunction) => {
    const query = req.query.search
      ? {
          $or: [{ name: { $regex: req.query.search, $options: "i" } }],
        }
      : {};
    const participantsOrAdmin = {
      $or: [{ admin: req.user.id }, { participants: req.user.id }],
    };

    const group = await Group.find(participantsOrAdmin)
      .find(query)
      .populate({
        path: "participants admin",
        select: "name",
      })
      .sort("-createdAt");
    res.status(200).json({ group });
  }
);

/**
 * @desc Rename group
 * @route PUT /api/v1/group/:id
 * @access Private
 */
export const renameGroup = asyncHandler(
  async (req: NewCustomRequest, res: Response, next: NextFunction) => {
    let group = await Group.findById(req.params.id);

    if (!group) {
      return next(new ErrorResponse("Group Not Found.", 404));
    }

    if (group?.admin.toString() !== req.user.id) {
      return next(new ErrorResponse("Not authorized.", 401));
    }

    group = await Group.findByIdAndUpdate(req.params.id, req.body, {
      runValidators: true,
      new: true,
    });

    res.status(200).json({ success: true, group });
  }
);

/**
 * @desc Leave group
 * @route PUT /api/v1/group/:id
 * @access Private
 */
export const leaveGroup = asyncHandler(
  async (req: NewCustomRequest, res: Response, next: NextFunction) => {
    let group = await Group.findById(req.params.id);

    if (!group) {
      return next(new ErrorResponse("Group Not Found.", 404));
    }

    group = await Group.findByIdAndUpdate(
      req.params.id,
      {
        $pull: { participants: req.body.userId },
      },
      {
        runValidators: true,
        new: true,
      }
    ).populate({
      path: "participants admin",
      select: "name",
    });

    res.status(200).json({ success: true });
  }
);

/**
 * @desc Join group
 * @route PUT /api/v1/group/:id/add
 * @access Private
 */
export const joinGroup = asyncHandler(
  async (req: NewCustomRequest, res: Response, next: NextFunction) => {
    let group = await Group.findById(req.params.id).populate({
      path: "participants admin",
      select: "_id",
    });

    if (!group) {
      return next(new ErrorResponse("Group Not Found.", 404));
    }

    // If current user is admin
    if (group.admin === req.body.userId) {
      return next(new ErrorResponse("You are admin", 400));
    }

    group = await Group.findByIdAndUpdate(
      req.params.id,
      {
        $push: { participants: req.body.userId },
      },
      {
        runValidators: true,
        new: true,
      }
    ).populate({
      path: "participants admin",
      select: "name",
    });

    res.status(200).json(group);
  }
);
