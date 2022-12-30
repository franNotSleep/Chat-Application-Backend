var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import mongoose from 'mongoose';
// Connecting to mongoDB
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    mongoose.set("strictQuery", true);
    const URI = process.env.MONGO_URI;
    if (typeof URI === "string") {
        const conn = yield mongoose.connect(URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`.bgGreen.white);
    }
});
export default connectDB;
//# sourceMappingURL=db.js.map