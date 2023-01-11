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
import ErrorResponse from '../utils/errorResponse.js';
/**
 * @desc Create Group
 * @route POST /api/v1/group/
 * @access Private
 */
export const createGroup = asyncHandler((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const reqBody = {
        name: req.body.name,
        admin: req.user.id,
        participants: req.body.participants,
    };
    console.log(reqBody);
    const group = yield (yield Group.create(reqBody)).populate({
        path: "admin participants",
        select: "name",
    });
    res.status(200).json(group);
}));
/**
 * @desc Get Groups
 * @route GET /api/v1/group?search=
 * @access Public
 */
export const getGroups = asyncHandler((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query.search
        ? {
            $or: [{ name: { $regex: req.query.search, $options: "i" } }],
        }
        : {};
    const group = yield Group.find(query)
        .populate({
        path: "admin participants",
        select: "name",
    })
        .sort("-createdAt");
    res.status(200).json({ group });
}));
/**
 * @desc Get Groups by current user
 * @route GET /api/v1/user/group?search=
 * @access Private
 */
export const getUserGroups = asyncHandler((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query.search
        ? {
            $or: [{ name: { $regex: req.query.search, $options: "i" } }],
        }
        : {};
    const participantsOrAdmin = {
        $or: [{ admin: req.user.id }, { participants: req.user.id }],
    };
    const group = yield Group.find(participantsOrAdmin)
        .find(query)
        .populate({
        path: "participants admin",
        select: "name",
    })
        .sort("-createdAt");
    res.status(200).json({ group });
}));
/**
 * @desc Rename group
 * @route PUT /api/v1/group/:id
 * @access Private
 */
export const renameGroup = asyncHandler((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let group = yield Group.findById(req.params.id);
    if (!group) {
        return next(new ErrorResponse("Group Not Found.", 404));
    }
    if ((group === null || group === void 0 ? void 0 : group.admin.toString()) !== req.user.id) {
        return next(new ErrorResponse("Not authorized.", 401));
    }
    group = yield Group.findByIdAndUpdate(req.params.id, req.body, {
        runValidators: true,
        new: true,
    });
    res.status(200).json({ success: true, group });
}));
/**
 * @desc Leave group
 * @route GET /api/v1/group/:id
 * @access Private
 */
export const leaveGroup = asyncHandler((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let group = yield Group.findById(req.params.id);
    if (!group) {
        return next(new ErrorResponse("Group Not Found.", 404));
    }
    group = yield Group.findByIdAndUpdate(req.params.id, {
        $pull: { participants: req.body.userId },
    }, {
        runValidators: true,
        new: true,
    }).populate({
        path: "participants admin",
        select: "name",
    });
    res.status(200).json({ success: true });
}));
/**
 * @desc Join group
 * @route PUT /api/v1/group/:id/add
 * @access Private
 */
export const joinGroup = asyncHandler((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let group = yield Group.findById(req.params.id).populate({
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
    group = yield Group.findByIdAndUpdate(req.params.id, {
        $push: { participants: req.body.userId },
    }, {
        runValidators: true,
        new: true,
    }).populate({
        path: "participants admin",
        select: "name",
    });
    res.status(200).json(group);
}));
//# sourceMappingURL=group.js.map