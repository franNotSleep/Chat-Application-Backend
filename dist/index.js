"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const colors_1 = __importDefault(require("colors"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const db_1 = require("./config/db");
const app = (0, express_1.default)();
// Enable CORS
app.use((0, cors_1.default)());
// Load env vars
dotenv_1.default.config({ path: "./config/.env" });
// Connect to MongoDB
(0, db_1.connectDB)();
const port = process.env.PORT;
let server = app.listen(port, () => {
    console.log(colors_1.default.yellow(`⚡️[server]: Server is running at http://localhost:${port}`));
});
process.on("unhandledRejection", (err, promise) => {
    console.log(colors_1.default.red(err.message));
    // close server and exit
    server.close(() => process.exit(1));
});
