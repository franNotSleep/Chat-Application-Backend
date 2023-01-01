import colors from 'colors';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';

import connectDB from './config/db.js';
import errorHandler from './middleware/errorHandler.js';
import authRouter from './routes/auth.js';

// Load env vars
dotenv.config({ path: "./config/.env" });

const app = express();

// Body parser
app.use(express.json());

// Cookie Parser
app.use(cookieParser());

// Enable CORS
app.use(cors());

// Dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Connect to MongoDB
connectDB();

// Mount routes
app.use("/api/v1/auth", authRouter);

//  Handle errors
app.use(errorHandler);

const port = process.env.PORT;
let server = app.listen(port, () => {
  console.log(
    colors.yellow(`⚡️[server]: Server is running at http://localhost:${port}`)
  );
});

process.on("unhandledRejection", (err: Error, promise) => {
  console.log(colors.red(err.message));

  // close server and exit
  // server.close(() => process.exit(1));
});
