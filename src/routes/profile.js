const express = require("express");
const profileRouter = express.Router();

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
    const loggedInUser = await req.user;
    if (!validateFieldsToUpdate(req)) {
      throw new Error("Invalid field to update");
    }
    const updateUserObj = {};
    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
    const userToUpdate = await loggedInUser.save();
    res.json({ message: "Profile updated successfully!!", data: userToUpdate });
  } catch (error) {
    res.status(500).send("Error fetching profile: " + error.message);
  }
});

module.exports = profileRouter;
