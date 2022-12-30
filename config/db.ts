import mongoose from 'mongoose';

// Connecting to mongoDB
export const connectDB = async (): Promise<void> => {
  mongoose.set("strictQuery", true);
  const URI = process.env.MONGO_URI;
  if (typeof URI === "string") {
    const conn = await mongoose.connect(URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`.bgGreen.white);
  }
};
