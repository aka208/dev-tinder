const express = require("express");
const profileRouter = express.Router();

const User = require("../models/user");

const { userAuth } = require("../middlewares/userAuth");
const { validateFieldsToUpdate } = require("../utils/validator");

profileRouter.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (error) {
    res.status(500).send("Error fetching profile: " + error.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    const user = req.user;
    if (!validateFieldsToUpdate(req)) {
      throw new Error("Invalid field to update");
    }
    const updateUserObj = {};
    Object.keys(user).forEach((key) => (updateUserObj[key] = req.body[key]));
    const userToUpdate = await User.findByIdAndUpdate(user._id, updateUserObj);
    // res.send("Profile updated successfully!!");
    res.json({ message: "Profile updated successfully!!", data: userToUpdate });
  } catch (error) {
    res.status(500).send("Error fetching profile: " + error.message);
  }
});

module.exports = profileRouter;
