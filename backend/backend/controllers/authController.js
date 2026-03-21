const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  createUser,
  findUserByEmail,
  findUserByUsernameOrEmail,
} = require("../models/userModel");

const register = async (req, res, next) => {
  try {
    const { username, email, password, faculty, year, interests, profile_image_url } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "username, email, and password are required." });
    }

    const existing = await findUserByUsernameOrEmail(username, email);
    if (existing) {
      return res.status(409).json({ message: "Username or email already exists." });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const userId = await createUser({
      username,
      email,
      passwordHash,
      faculty,
      year,
      interests,
      profileImageUrl: profile_image_url,
    });

    return res.status(201).json({
      message: "User registered successfully.",
      user: { id: userId, username, email },
    });
  } catch (error) {
    return next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "email and password are required." });
    }

    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, username: user.username },
      process.env.JWT_SECRET || "dev_secret",
      { expiresIn: "7d" }
    );

    return res.json({
      message: "Login successful.",
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = { register, login };
