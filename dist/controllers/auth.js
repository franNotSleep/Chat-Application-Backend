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
import { UserModel } from '../model/User.js';
import ErrorResponse from '../utils/errorResponse.js';
/**
 * @desc Sign up User
 * @route POST /api/v1/auth/register
 * @access Public
 */
export const register = asyncHandler((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const reqBody = req.body;
    // Creating User
    const newUser = yield UserModel.create(reqBody);
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
    const user = yield UserModel.findOne({ email: reqBody.email }).select("+password");
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
 * @desc Log user out & clear cookie
 * @route GET /api/v1/auth/logout
 * @access Private
 */
export const me = asyncHandler((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(200).json({ hola: "hola" });
}));
/**
 * Create token
 * Put token into cookie
 * token expires in 30d
 * @param (user, res, statusCode)
 */
function createAndSendToken(user, res, statusCode) {
    const token = user.getSignJwToken();
    if (typeof process.env.JWT_COOKIE_EXPIRE === "string") {
        const expireDate = process.env.JWT_COOKIE_EXPIRE;
        let options = {
            expires: new Date(Date.now() + Number(expireDate) * 24 * 60 * 60 * 1000),
            httpOnly: true,
        };
        if (process.env.NODE_ENV === "production") {
            options.secure = true;
        }
        res.status(statusCode).cookie("token", token, options).json({ token });
    }
}
//# sourceMappingURL=auth.js.map