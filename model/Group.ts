import mongoose, { Schema, Types } from 'mongoose';

export interface IGroup {
  _id?: string | Types.ObjectId;
  name: string;
  admin: Types.ObjectId | string;
  participants: Types.ObjectId;
  private?: boolean;
  pic: string;
}

const groupSchema = new Schema<IGroup>(
  {
    name: { type: String, required: [true, "Please add a name"], unique: true },
    pic: {
      type: String,
      required: true,
      default: `https://api.dicebear.com/5.x/pixel-art/svg?seed=default`,
    },
    admin: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// asign an pic to the user
groupSchema.pre("save", function (next) {
  this.pic = `https://api.dicebear.com/5.x/identicon/svg?seed=${name}`;
  next();
});

const Group = mongoose.model<IGroup>("Group", groupSchema);

export default Group;
