const express = require("express");
const { validateSignupRequest } = require("../utils/validator");
const bcrypt = require("bcrypt");
const authRouter = express.Router();
const User = require("../models/user");

authRouter.post("/signup", async (req, res) => {
  try {
    // validate request body
    validateSignupRequest(req.body);
    // Encrypt password
    const encryptedPassword = await bcrypt.hash(req.body.password, 10);

    const requestUser = { ...req.body, password: encryptedPassword };
    const user = new User(requestUser);
    await user.save();
    res.send("User signed up successfully");
  } catch (error) {
    res.status(500).send("Error signing up user: " + error.message);
  }
});

authRouter.post("/login", async (req, res) => {
  const { emailId, password } = req.body;
  try {
    const user = await User.findOne({ emailId });
    if (!user) {
      throw new Error("User not found");
    }
    const isPasswordMatch = await user.validatePassword(password);
    if (!isPasswordMatch) {
      throw new Error("Invalid password");
    }
    const token = await user.getJwtToken();
    res.cookie("token", token);
    res.json(user);
  } catch (error) {
    res.status(500).send("Error logging in: " + error.message);
  }
});

authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, { expires: new Date(Date.now()) });
  res.send("Logged out!");
});
module.exports = authRouter;
