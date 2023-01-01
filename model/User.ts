import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

export interface User {
  name: string;
  email: string;
  aboutMe?: string;
  password: string;
}

export interface UserMethods {
  getSignJwToken(): string;
  matchPassword(enteredPassword: string): Promise<boolean>;
}

type UserModel = mongoose.Model<User, {}, UserMethods>;

const UserSchema = new mongoose.Schema<User, UserModel, UserMethods>({
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
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.getSignJwToken = function (): string {
  if (typeof process.env.JWT_SECRET === "string") {
    return jwt.sign({ id: this._id.toString() }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    });
  }
  return "";
};

UserSchema.methods.matchPassword = async function matchPassword(
  enteredPassword: string
): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

const UserModel = mongoose.model<User, UserModel>("User", UserSchema);

export { UserModel };
