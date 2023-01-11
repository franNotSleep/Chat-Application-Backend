import mongoose, { Schema } from 'mongoose';
const groupSchema = new Schema({
    name: { type: String, required: [true, "Please add a name"], unique: true },
    admin: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    participants: [
        {
            type: Schema.Types.ObjectId,
            unique: true,
            ref: "User",
        },
    ],
    private: { type: Boolean, default: true },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
const Group = mongoose.model("Group", groupSchema);
export default Group;
//# sourceMappingURL=Group.js.map