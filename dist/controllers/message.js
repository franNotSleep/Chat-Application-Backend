var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import asyncHandler from '../middleware/asyncHandler.js';
import Group from '../model/Group.js';
import Message from '../model/Message.js';
import ErrorResponse from '../utils/errorResponse.js';
/**
 * @desc Create Message
 * @route POST /api/v1/message/:groupId/message
 * @access Private
 */
export const createMessage = asyncHandler((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const group = yield Group.findById(req.params.groupId);
    if (!group) {
        return next(new ErrorResponse(`Group with id: ${req.params.groupId} was not found.`, 404));
    }
    const message = yield Message.create({
        group: req.params.groupId,
        sender: req.user.id,
        content: req.body.content,
    });
    res.status(201).json(message);
}));
/**
 * @desc Get all messages
 * @route GET /api/v1/:groupId/message
 * @access Public
 */
export const getMessages = asyncHandler((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const group = yield Group.findById(req.params.groupId);
    if (!group) {
        return next(new ErrorResponse(`Group with id: ${req.params.groupId} was not found.`, 404));
    }
    const message = yield Message.find({ group: req.params.groupId }).populate({
        path: "group",
        select: "name _id",
    });
    res.status(200).json(message);
}));
/**
 * @desc Delete message
 * @route DELETE /api/v1/message/:id
 * @access Private
 */
export const deleteMessage = asyncHandler((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const message = yield Message.findById(req.params.id);
    if (!message) {
        return next(new ErrorResponse("Message Not Found.", 404));
    }
    if ((message === null || message === void 0 ? void 0 : message.sender.toString()) !== req.user.id) {
        return next(new ErrorResponse("Not authorized.", 401));
    }
    yield (message === null || message === void 0 ? void 0 : message.remove());
    res.status(200).json({ success: true });
}));
//# sourceMappingURL=message.js.map