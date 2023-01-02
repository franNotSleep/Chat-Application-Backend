import mongoose, { Schema } from 'mongoose';
const messageSchema = new Schema({
    sender: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    content: {
        type: String,
        trim: true,
    },
}, { timestamps: true });
const Message = mongoose.model("Message", messageSchema);
export default Message;
//# sourceMappingURL=Message.js.map