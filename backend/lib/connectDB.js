import dotenv from 'dotenv';
dotenv.config();

import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.mongo);
    console.log("MongoDB is connected");
  } catch (err) {
    console.log(err);
  }
};

export default connectDB;