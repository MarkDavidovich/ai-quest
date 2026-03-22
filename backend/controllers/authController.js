const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel.js");
require("dotenv").config();

const register = async (req, res) => {
  const { email, password, firstName, lastName } = req.body;

  if (!password) {
    return res.status(400).json({ error: "Password is required" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10); // hash password
    const createdUser = await User.create(
      email,
      hashedPassword,
      firstName,
      lastName
    ); // create user

    res.status(201).json({
      success: true,
      status: 201,
      message: "User created!",
      user: {
        id: createdUser.id,
        email: createdUser.email,
        firstName: createdUser.firstName,
        lastName: createdUser.lastName,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Sequelize query to find user
    const foundUser = await User.findOne({ where: { email } });
    if (!foundUser) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, foundUser.password); // compare password
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: foundUser.id },
      process.env.JWT_SECRET || "secret_key",
      { expiresIn: "12h" },
    ); // create token

    res.json({
      success: true,
      status: 200,
      message: "Login successful",
      user: {
        id: foundUser.id,
        email: foundUser.email,
        firstName: foundUser.firstName,
        lastName: foundUser.lastName,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  register,
  login,
};
