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
import ErrorResponse from '../utils/errorResponse.js';
/**
 * @desc Sign up User
 * @route POST /api/v1/auth/register
 * @access Public
 */
export const register = asyncHandler((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const reqBody = req.body;
    // Creating User
    const newUser = yield userModel.create(reqBody);
    createAndSendToken(newUser, res, 200);
}));
/**
 * @desc Log in User
 * @route POST /api/v1/auth/login
 * @access Public
 */
export const login = asyncHandler((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const reqBody = req.body;
    // Validate email & password
    if (!reqBody.email || !reqBody.password) {
        return next(new ErrorResponse("Please provide an email and password", 400));
    }
    // Check if user exist and password is correct
    const user = yield userModel
        .findOne({ email: reqBody.email })
        .select("+password");
    if (!user) {
        return next(new ErrorResponse("Invalid Credentials", 401));
    }
    // Check password
    const matchPassword = yield user.matchPassword(reqBody.password);
    if (!matchPassword) {
        return next(new ErrorResponse("Invalid Credentials", 401));
    }
    createAndSendToken(user, res, 200);
}));
/**
 * @desc Log user out & clear cookie
 * @route GET /api/v1/auth/logout
 * @access Private
 */
export const logout = asyncHandler((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    res.cookie("token", "none", {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
    });
    res.status(200).json({ success: true });
}));
/**
 * @desc Get current logged in user
 * @route GET /api/v1/auth/me
 * @access Private
 */
export const me = asyncHandler((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(200).json({ success: true, data: req.user });
}));
/**
 * @desc  Update user details
 * @route PUT /api/v1/auth/uptdetails
 * @access Private
 */
export const updateDetails = asyncHandler((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const fields = {
        name: req.body.name,
        email: req.body.email,
    };
    const user = yield userModel.findByIdAndUpdate(req.user.id, fields, {
        new: true,
        runValidators: true,
    });
    res.status(200).json({ success: true, data: user });
}));
/**
 * @desc  Update user password
 * @route PUT /api/v1/auth/uptpassword
 * @access Private
 */
export const updatePassword = asyncHandler((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const reqBody = {
        currentPassword: req.body.currentPassword,
        newPassword: req.body.newPassword,
    };
    const user = yield userModel.findById(req.user.id).select("+password");
    // Check current password
    const isMatch = yield (user === null || user === void 0 ? void 0 : user.matchPassword(reqBody.currentPassword));
    if (!isMatch) {
        return next(new ErrorResponse("Password is incorrect.", 401));
    }
    // if user is not null
    if (user) {
        user.password = reqBody.newPassword;
        yield user.save();
        createAndSendToken(user, res, 200);
    }
}));
function createAndSendToken(user, res, statusCode) {
    const token = user.getSignJwToken();
    if (typeof process.env.JWT_COOKIE_EXPIRE === "string") {
        const expireDate = process.env.JWT_COOKIE_EXPIRE;
        let options = {
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
        });
    }
}
//# sourceMappingURL=auth.js.map