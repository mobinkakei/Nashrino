import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export const getUserSavedPosts = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]; // Bearer token
    if (!token) return res.status(401).json("Not authenticated!");

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) return res.status(404).json("User not found!");

    res.status(200).json(user.savedPosts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const savePost = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json("Not authenticated!");

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) return res.status(404).json("User not found!");

    const postId = req.body.postId;
    const isSaved = user.savedPosts.some((p) => p === postId);

    if (!isSaved) {
      await User.findByIdAndUpdate(user._id, { $push: { savedPosts: postId } });
      res.status(200).json("Post saved");
    } else {
      await User.findByIdAndUpdate(user._id, { $pull: { savedPosts: postId } });
      res.status(200).json("Post unsaved");
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateUser = async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json("Not authenticated!");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) return res.status(404).json("User not found");

    const updatedData = req.body;
    Object.assign(user, updatedData); // به‌روزرسانی فیلدها

    if (updatedData.img) {
      user.img = updatedData.img; 
    }

    const updatedUser = await user.save();
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};