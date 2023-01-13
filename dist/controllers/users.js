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
import { userModel } from '../model/User.js';
/**
 * @desc Get Users
 * @route Get /api/v1/user?search=
 * @access Public
 */
export const getUsers = asyncHandler((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query.search
        ? {
            $or: [
                { name: { $regex: req.query.search, $options: "i" } },
                { email: { $regex: req.query.search, $options: "i" } },
            ],
        }
        : {};
    const users = yield userModel
        .find(query)
        .find({ _id: { $ne: req.user._id } });
    res.status(200).json({ users });
}));
//# sourceMappingURL=users.js.map