var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please add a name"],
        unique: true,
    },
    email: {
        type: String,
        required: [true, "Please add a email"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Please add a password"],
        minlength: 6,
        select: false,
    },
    aboutMe: {
        type: String,
        maxLength: [500, `Description can't be more than 500 characters`],
    },
});
// Encrypt Password
UserSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!this.isModified("password")) {
            next();
        }
        const salt = yield bcrypt.genSalt(10);
        this.password = yield bcrypt.hash(this.password, salt);
        next();
    });
});
UserSchema.methods.getSignJwToken = function () {
    if (typeof process.env.JWT_SECRET === "string") {
        return jwt.sign({ id: this._id.toString() }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRE,
        });
    }
    return "";
};
UserSchema.methods.matchPassword = function matchPassword(enteredPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcrypt.compare(enteredPassword, this.password);
    });
};
const UserModel = mongoose.model("User", UserSchema);
export { UserModel };
//# sourceMappingURL=User.js.map