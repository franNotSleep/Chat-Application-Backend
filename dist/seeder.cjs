"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const colors_1 = __importDefault(require("colors"));
const dotenv_1 = __importDefault(require("dotenv"));
const fs_1 = require("fs");
const mongoose_1 = __importDefault(require("mongoose"));
const User_js_1 = require("./model/User.js");
// Load env vars
dotenv_1.default.config({ path: "./config/.env" });
// Connect to DB
mongoose_1.default.set("strictQuery", true);
const URI = process.env.MONGO_URI;
if (typeof URI === "string") {
    mongoose_1.default.connect(URI);
}
// Read JSON files
console.log(colors_1.default.america(__dirname));
const readJSONfiles = (file) => {
    JSON.parse((0, fs_1.readFileSync)(`${__dirname}/data/${file}.json`, "utf-8"));
};
// Import into DB
const importData = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield User_js_1.UserModel.create(readJSONfiles("users"));
        console.log(colors_1.default.green.bgWhite("Data imported..."));
    }
    catch (err) {
        console.log(err);
        process.exit();
    }
});
const deleteData = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield User_js_1.UserModel.deleteMany();
        console.log(colors_1.default.white.bgRed("Data deleted..."));
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
//# sourceMappingURL=seeder.cjs.map