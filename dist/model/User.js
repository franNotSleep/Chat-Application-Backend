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
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please add a name"],
        unique: true,
    },
    email: {
        type: String,
        required: [true, "Please add a email"],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            "Please add a valid email",
        ],
    },
    password: {
        type: String,
        required: [true, "Please add a password"],
        minlength: 6,
        select: false,
    },
    avatar: {
        type: String,
        required: true,
        default: `https://api.dicebear.com/5.x/pixel-art/svg?seed=default`,
    },
    aboutMe: {
        type: String,
        maxLength: [500, `Description can't be more than 500 characters`],
    },
});
// asign an avatar to the user
userSchema.pre("save", function (next) {
    // Example:  Greg Harris -> ["Greg", "Harris"] -> Greg
    let userName = this.name.split(" ")[0];
    this.avatar = `https://api.dicebear.com/5.x/pixel-art/svg?seed=${userName}`;
    next();
});
// Encrypt Password
userSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!this.isModified("password")) {
            next();
        }
        const salt = yield bcrypt.genSalt(10);
        this.password = yield bcrypt.hash(this.password, salt);
        next();
    });
});
userSchema.methods.getSignJwToken = function () {
    if (typeof process.env.JWT_SECRET === "string") {
        return jwt.sign({ id: this._id.toString() }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRE,
        });
    }
    return "";
};
userSchema.methods.matchPassword = function matchPassword(enteredPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcrypt.compare(enteredPassword, this.password);
    });
};
const userModel = mongoose.model("User", userSchema);
export { userModel };
//# sourceMappingURL=User.js.map