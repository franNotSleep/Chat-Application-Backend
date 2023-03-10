import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import mongoose, { Types } from 'mongoose';

export interface User {
  _id?: Types.ObjectId | string;
  name: string;
  email: string;
  aboutMe?: string;
  password: string;
  avatar: string;
}

export interface UserMethods {
  getSignJwToken(): string;
  matchPassword(enteredPassword: string): Promise<boolean>;
}

export type UserModel = mongoose.Model<User, {}, UserMethods>;

const userSchema = new mongoose.Schema<User, UserModel, UserMethods>({
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
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.getSignJwToken = function (): string {
  if (typeof process.env.JWT_SECRET === "string") {
    return jwt.sign({ id: this._id.toString() }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    });
  }
  return "";
};

userSchema.methods.matchPassword = async function matchPassword(
  enteredPassword: string
): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

const userModel = mongoose.model<User, UserModel>("User", userSchema);

export { userModel };
