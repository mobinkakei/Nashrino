import express from 'express';
import { getUserSavedPosts, savePost, updateUser } from '../controllers/user.controller.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

const authenticateJWT = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json("Not authenticated!");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json("Invalid token!");
  }
};

router.get("/saved", authenticateJWT, getUserSavedPosts);
router.patch("/save", authenticateJWT, savePost);
router.patch("/update", authenticateJWT, updateUser); // اضافه شده

export default router;