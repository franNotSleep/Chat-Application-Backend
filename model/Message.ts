import mongoose, { Schema, Types } from 'mongoose';

export interface IMessage {
  _id: Types.ObjectId;
  sender: Types.ObjectId;
  content: string;
  group: Types.ObjectId;
}

const messageSchema = new Schema<IMessage>(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    content: {
      type: String,
      trim: true,
    },
    group: {
      type: Schema.Types.ObjectId,
      ref: "Group",
      required: true,
    },
  },
  { timestamps: true }
);

const Message = mongoose.model<IMessage>("Message", messageSchema);

export default Message;
