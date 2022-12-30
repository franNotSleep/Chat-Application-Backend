import colors from 'colors';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';

import { connectDB } from './config/db';

const app = express();

// Enable CORS
app.use(cors());

// Load env vars
dotenv.config({ path: "./config/.env" });

// Connect to MongoDB
connectDB();

const port = process.env.PORT;
let server = app.listen(port, () => {
  console.log(
    colors.yellow(`⚡️[server]: Server is running at http://localhost:${port}`)
  );
});

process.on("unhandledRejection", (err: Error, promise) => {
  console.log(colors.red(err.message));

  // close server and exit
  server.close(() => process.exit(1));
});
