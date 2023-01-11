import colors from 'colors';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import ExpressMongoSanitize from 'express-mongo-sanitize';
import helmet from 'helmet';
import http from 'http';
import morgan from 'morgan';
import { Server } from 'socket.io';
import connectDB from './config/db.js';
import errorHandler from './middleware/errorHandler.js';
import authRouter from './routes/auth.js';
import groupRoute from './routes/group.js';
import messageRoute from './routes/message.js';
import userRoute from './routes/users.js';
// Load env vars
dotenv.config({ path: "./config/.env" });
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    pingTimeout: 60000,
    cors: {
        origin: "*",
    },
});
io.on("connection", (socket) => {
    socket.on("setup", (user) => {
        if (typeof user._id === "string") {
            socket.join(user._id);
            socket.emit("connected");
        }
    });
    socket.on("join-room", (room) => {
        if (typeof room === "string") {
            console.log(colors.bgBlue(`User has joined to ${room}`));
            socket.join(room);
        }
    });
    socket.on("send-message", (msg) => {
        if (typeof msg.group === "string") {
            console.log(msg);
            console.log(colors.bgGreen(`Message emit to ${msg.group}: ${msg}`));
            socket.to(msg.group).emit("chat", msg);
        }
    });
});
// Body parser
app.use(express.json());
// Cookie Parser
app.use(cookieParser());
// Enable CORS
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));
// Sanitize data
app.use(ExpressMongoSanitize());
// Set security header
app.use(helmet());
// Prevent http param pollution
// Dev logging middleware
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}
// Connect to MongoDB
connectDB();
// Mount routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/message", messageRoute);
app.use("/api/v1/group", groupRoute);
//  Handle errors
app.use(errorHandler);
const port = process.env.PORT;
server.listen(port, () => {
    console.log(colors.yellow(`⚡️[server]: Server is running at http://localhost:${port}`));
});
process.on("unhandledRejection", (err, promise) => {
    console.log(colors.red(err.message));
    // close server and exit
    // server.close(() => process.exit(1));
});
//# sourceMappingURL=index.js.map