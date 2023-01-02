import colors from 'colors';
import dotenv from 'dotenv';
import { readFileSync } from 'fs';
import mongoose from 'mongoose';

import { userModel } from './model/User.js';

// Load env vars
// dotenv.config({ path: "./config/.env" });
dotenv.config({ path: "../config/.env" });

// Connect to DB
const connectDB = async (): Promise<void> => {
  mongoose.set("strictQuery", true);
  const URI = process.env.MONGO_URI;
  if (typeof URI === "string") {
    await mongoose.connect(URI);
  }
};
connectDB();

// Read JSON files
const dirname = "C:/Users/frany/OneDrive/Desktop/chat-app/backend";

const readJSONfiles = (file: string) => {
  return JSON.parse(readFileSync(`${dirname}/data/${file}.json`, "utf-8"));
};

// Import to DB
const importData = async () => {
  try {
    await userModel.create(readJSONfiles("users"));
    console.log(colors.green.bgWhite("Data imported..."));
    process.exit();
  } catch (err) {
    console.log(err);
    process.exit();
  }
};

const deleteData = async () => {
  try {
    await userModel.deleteMany();
    console.log(colors.white.bgRed("Data deleted..."));
    process.exit();
  } catch (error) {
    console.log(error);
    process.exit();
  }
};

if (process.argv[2] === "-i") {
  importData();
} else if (process.argv[2] === "-d") {
  deleteData();
}
