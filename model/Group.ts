import mongoose, { Schema, Types } from 'mongoose';

export interface IGroup {
  _id?: string | Types.ObjectId;
  name: string;
  admin: Types.ObjectId | string;
  participants: Types.ObjectId;
  private?: boolean;
}

const groupSchema = new Schema<IGroup>(
  {
    name: { type: String, required: [true, "Please add a name"], unique: true },
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

const Group = mongoose.model<IGroup>("Group", groupSchema);

export default Group;
