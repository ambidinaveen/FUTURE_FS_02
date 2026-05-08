const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const createToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });

const loginAdmin = async (req, res) => {
  const { email, password } = req.body;
  const normalizedEmail = String(email).toLowerCase().trim();

  const admin = await Admin.findOne({ email: normalizedEmail }).select('+password');
  if (!admin) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const isPasswordValid = await admin.comparePassword(password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = createToken(admin._id);
  const safeAdmin = await Admin.findById(admin._id).select('-password');

  return res.json({
    message: 'Login successful',
    token,
    admin: safeAdmin
  });
};

const getCurrentAdmin = async (req, res) => {
  res.json({ admin: req.user });
};

const logoutAdmin = async (req, res) => {
  res.json({ message: 'Logged out successfully' });
};

module.exports = {
  loginAdmin,
  getCurrentAdmin,
  logoutAdmin
};
