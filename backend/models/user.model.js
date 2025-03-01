import dotenv from 'dotenv';
dotenv.config();

import { Schema } from "mongoose";
import mongoose from "mongoose";

const userSchema = new Schema(
{
  username: {
    type: String,
    required: true, 
    unique: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  nationalId: { 
    type: String, 
    required: true, 
    unique: true 
  }, // کد ملی
  phoneNumber: { 
    type: String, 
    required: true, 
    unique: true 
  }, // شماره همراه
  lastName: { 
    type: String, 
    required: true 
  }, // نام خانوادگی
  img: { 
    type: String 
  },
  savedPosts: { 
    type: [String], 
    default: [] 
  },
  role: { 
    type: String, 
    default: "user" 
  },
},
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
