import mongoose, { Schema } from 'mongoose';
const chatSchema = new Schema({
    name: {
        type: String,
        required: [true, "Please add a name"],
    },
    isGroupChat: {
        type: Boolean,
        default: false,
    },
    users: [
        {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    latestMessage: {
        type: Schema.Types.ObjectId,
        ref: "Message",
    },
    groupAdmin: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
}, { timestamps: true });
const Chat = mongoose.model("Chat", chatSchema);
export default Chat;
//# sourceMappingURL=Chat.js.map