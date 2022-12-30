import colors from 'colors';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';

import connectDB from './config/db.js';
import authRouter from './routes/auth.js';

// Load env vars
dotenv.config({ path: "./config/.env" });

const app = express();

// Body parser
app.use(express.json());

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

app.get("/api/v1/auth/l", (req, res: express.Response) => {
  res.status(200).json(true);
});

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
