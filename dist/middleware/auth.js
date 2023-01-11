var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import jwt from 'jsonwebtoken';
import { userModel } from '../model/User.js';
import ErrorResponse from '../utils/errorResponse.js';
import asyncHandler from './asyncHandler.js';
// Protect routes
export const protect = asyncHandler((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let token = "";
    if (req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }
    else if (req.cookies.token) {
        token = req.cookies.token;
    }
    console.log(`token: ${token}`);
    // Check token
    if (!token) {
        return next(new ErrorResponse("Not Authorized", 401));
    }
    // Verify token
    try {
        if (typeof process.env.JWT_SECRET === "string") {
            const { id } = jwt.verify(token, process.env.JWT_SECRET);
            req.user = yield userModel.findById(id);
            next();
        }
    }
    catch (error) {
        return next(new ErrorResponse("Not Authorized", 401));
    }
}));
//# sourceMappingURL=auth.js.map