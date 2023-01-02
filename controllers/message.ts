import { NextFunction, Response } from 'express';

import asyncHandler from '../middleware/asyncHandler.js';
import Message from '../model/Message.js';
import ErrorResponse from '../utils/errorResponse.js';
import { NewCustomRequest } from './auth.js';

/**
 * @desc Create Message
 * @route POST /api/v1/message
 * @access Private
 */
export const createMessage = asyncHandler(
  async (req: NewCustomRequest, res: Response, next: NextFunction) => {
    const message = await Message.create({
      sender: req.user.id,
      content: req.body.content,
    });

    res.status(200).json(message);
  }
);

/**
 * @desc Get all messages
 * @route GET /api/v1/message
 * @access Public
 */
export const getMessages = asyncHandler(
  async (req: NewCustomRequest, res: Response, next: NextFunction) => {
    const message = await Message.find().populate("sender");
    res.status(201).json(message);
  }
);

/**
 * @desc Delete message
 * @route DELETE /api/v1/message/:id
 * @access Private
 */
export const deleteMessage = asyncHandler(
  async (req: NewCustomRequest, res: Response, next: NextFunction) => {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return next(new ErrorResponse("Message Not Found.", 404));
    }

    if (message?.sender.toString() !== req.user.id) {
      return next(new ErrorResponse("Not authorized.", 401));
    }

    await message?.remove();

    res.status(200).json({ success: true });
  }
);
