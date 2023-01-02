var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import colors from 'colors';
import dotenv from 'dotenv';
import { readFileSync } from 'fs';
import mongoose from 'mongoose';
import { userModel } from './model/User.js';
// Load env vars
// dotenv.config({ path: "./config/.env" });
dotenv.config({ path: "../config/.env" });
// Connect to DB
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    mongoose.set("strictQuery", true);
    const URI = process.env.MONGO_URI;
    if (typeof URI === "string") {
        yield mongoose.connect(URI);
    }
});
connectDB();
// Read JSON files
const dirname = "C:/Users/frany/OneDrive/Desktop/chat-app/backend";
const readJSONfiles = (file) => {
    return JSON.parse(readFileSync(`${dirname}/data/${file}.json`, "utf-8"));
};
// Import to DB
const importData = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield userModel.create(readJSONfiles("users"));
        console.log(colors.green.bgWhite("Data imported..."));
        process.exit();
    }
    catch (err) {
        console.log(err);
        process.exit();
    }
});
const deleteData = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield userModel.deleteMany();
        console.log(colors.white.bgRed("Data deleted..."));
        process.exit();
    }
    catch (error) {
        console.log(error);
        process.exit();
    }
});
if (process.argv[2] === "-i") {
    importData();
}
else if (process.argv[2] === "-d") {
    deleteData();
}
//# sourceMappingURL=seeder.js.map