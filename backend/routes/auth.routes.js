// import express from 'express';
// import { register, login } from '../controllers/auth.controller.js';

// const router = express.Router();

// router.post('/register', register);
// router.post('/login', login);
// router.get("/user", authenticateJWT, getUser); 

// export default router;

import express from 'express';
import { register, login, getUser } from '../controllers/auth.controller.js';
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

router.post("/register", register);
router.post("/login", login);
router.get("/user", authenticateJWT, getUser);

export default router;