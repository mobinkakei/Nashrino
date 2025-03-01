import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export const register = async (req, res) => {
  try {
    const { username, email, password, nationalId, phoneNumber, lastName } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword, nationalId, phoneNumber, lastName });
    await newUser.save();
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '72h' });
    res.json({ user: newUser, token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password'); // فقط password رو انتخاب کن
    if (!user) return res.status(404).json({ message: 'کاربر یافت نشد' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'اعتبارات نامعتبر' });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '72h' });
    res.json({ user: { _id: user._id, username: user.username, email: user.email }, token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getUser = async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json("Not authenticated!");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password'); // بدون رمز عبور
    if (!user) return res.status(404).json("User not found");
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};