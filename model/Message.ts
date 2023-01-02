import mongoose, { Schema, Types } from 'mongoose';

export interface IMessage {
  sender: Types.ObjectId;
  content: string;
  chat: Types.ObjectId;
  readBy: Types.ObjectId;
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
  },
  { timestamps: true }
);

const Message = mongoose.model<IMessage>("Message", messageSchema);

export default Message;
