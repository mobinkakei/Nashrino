import dotenv from 'dotenv';
dotenv.config();

import ImageKit from "imagekit";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import jwt from 'jsonwebtoken'; // اضافه کن

// Middleware برای احراز هویت JWT (مثل چیزی که تو user.route.js دادی)
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

export const getPosts = async (req, res) => {
  // این تابع به Clerk وابسته نیست، تغییری لازم نیست
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 2;

  const query = {};

  console.log(req.query);

  const cat = req.query.cat;
  const author = req.query.author;
  const searchQuery = req.query.search;
  const sortQuery = req.query.sort;
  const featured = req.query.featured;

  if (cat) {
    query.category = cat;
  }

  if (searchQuery) {
    query.title = { $regex: searchQuery, $options: "i" };
  }

  if (author) {
    const user = await User.findOne({ username: author }).select("_id");

    if (!user) {
      return res.status(404).json("No post found!");
    }

    query.user = user._id;
  }

  let sortObj = { createdAt: -1 };

  if (sortQuery) {
    switch (sortQuery) {
      case "newest":
        sortObj = { createdAt: -1 };
        break;
      case "oldest":
        sortObj = { createdAt: 1 };
        break;
      case "popular":
        sortObj = { visit: -1 };
        break;
      case "trending":
        sortObj = { visit: -1 };
        query.createdAt = {
          $gte: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000),
        };
        break;
      default:
        break;
    }
  }

  if (featured) {
    query.isFeatured = true;
  }

  const posts = await Post.find(query)
    .populate("user", "username")
    .sort(sortObj)
    .limit(limit)
    .skip((page - 1) * limit);

  const totalPosts = await Post.countDocuments();
  const hasMore = page * limit < totalPosts;

  res.status(200).json({ posts, hasMore });
};

export const getPost = async (req, res) => {
  // این تابع به Clerk وابسته نیست، تغییری لازم نیست
  const post = await Post.findOne({ slug: req.params.slug }).populate(
    "user",
    "username img"
  );
  res.status(200).json(post);
};

export const createPost = async (req, res) => {
  // جایگزینی clerkUserId با JWT
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json("Not authenticated!");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) return res.status(404).json("User not found!");

    let slug = req.body.title.replace(/ /g, "-").toLowerCase();

    let existingPost = await Post.findOne({ slug });

    let counter = 2;

    while (existingPost) {
      slug = `${slug}-${counter}`;
      existingPost = await Post.findOne({ slug });
      counter++;
    }

    const newPost = new Post({ user: user._id, slug, ...req.body });

    const post = await newPost.save();
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deletePost = async (req, res) => {
  // جایگزینی clerkUserId و role با JWT
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json("Not authenticated!");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) return res.status(404).json("User not found!");

    // اینجا باید نقش (role) رو از دیتابیس یا مدل User بگیریم
    const role = user.role || "user"; // فرض کن role تو مدل User داری

    if (role === "admin") {
      await Post.findByIdAndDelete(req.params.id);
      return res.status(200).json("Post has been deleted");
    }

    const deletedPost = await Post.findOneAndDelete({
      _id: req.params.id,
      user: user._id,
    });

    if (!deletedPost) return res.status(403).json("You can delete only your posts!");

    res.status(200).json("Post has been deleted");
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const featurePost = async (req, res) => {
  // جایگزینی clerkUserId و role با JWT
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json("Not authenticated!");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) return res.status(404).json("User not found!");

    const role = user.role || "user"; // فرض کن role تو مدل User داری

    if (role !== "admin") return res.status(403).json("You cannot feature posts!");

    const postId = req.body.postId;
    const post = await Post.findById(postId);

    if (!post) return res.status(404).json("Post not found!");

    const isFeatured = post.isFeatured;

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { isFeatured: !isFeatured },
      { new: true }
    );

    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const imagekit = new ImageKit({
  urlEndpoint: process.env.IK_URL_ENDPOINT,
  publicKey: process.env.IK_PUBLIC_KEY,
  privateKey: process.env.IK_PRIVATE_KEY,
});

export const uploadAuth = async (req, res) => {
  const result = imagekit.getAuthenticationParameters();
  res.send(result);
};