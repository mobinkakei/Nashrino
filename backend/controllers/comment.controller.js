import dotenv from 'dotenv';
dotenv.config();

import Comment from "../models/comment.model.js";
import User from "../models/user.model.js";
import jwt from 'jsonwebtoken'; // اضافه کن

// Middleware برای احراز هویت JWT
const authenticateJWT = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json("Not authenticated!");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // اضافه کردن کاربر به req
    next();
  } catch (err) {
    res.status(401).json("Invalid token!");
  }
};

export const getPostComments = async (req, res) => {
  // این تابع به Clerk وابسته نیست، تغییری لازم نیست
  const comments = await Comment.find({ post: req.params.postId })
    .populate("user", "username img")
    .sort({ createdAt: -1 });

  res.json(comments);
};

export const addComment = async (req, res) => {
  // جایگزینی clerkUserId با JWT
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json("Not authenticated!");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) return res.status(404).json("User not found!");

    const postId = req.params.postId;

    const newComment = new Comment({
      ...req.body,
      user: user._id,
      post: postId,
    });

    const savedComment = await newComment.save();

    res.status(201).json(savedComment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteComment = async (req, res) => {
  // جایگزینی clerkUserId و role با JWT
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json("Not authenticated!");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) return res.status(404).json("User not found!");

    const role = user.role || "user"; // فرض کن role تو مدل User داری

    if (role === "admin") {
      await Comment.findByIdAndDelete(req.params.id);
      return res.status(200).json("Comment has been deleted");
    }

    const deletedComment = await Comment.findOneAndDelete({
      _id: req.params.id,
      user: user._id,
    });

    if (!deletedComment) return res.status(403).json("You can delete only your comment!");

    res.status(200).json("Comment deleted");
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};