const connectDB = require("./config/database");
const express = require("express");
const User = require("./models/user");
const { validateSignupRequest } = require("./utils/validator");
const bcrypt = require("bcrypt");

const app = express();

app.use(express.json());

app.post("/signup", async (req, res) => {
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

app.get("/feeds", async (req, res) => {
  try {
    const feeds = await User.find();
    if (feeds.length === 0) {
      res.status(404).send("No feeds found");
    } else {
      res.send(feeds);
    }
  } catch (error) {
    res.status(500).send("Error fetching feeds: " + error.message);
  }
});

// Homework
app.get("/user", async (req, res) => {
  const emailId = req.query.emailId;
  try {
    const user = await User.find({ emailId: emailId });
    res.send(user);
  } catch (error) {
    res.status(500).send("Error fetching user: " + error.message);
  }
});

app.delete("/delete", async (req, res) => {
  const userId = req.body.userId;
  try {
    await User.findByIdAndDelete(userId);
    res.send("User deleted successfully");
  } catch (error) {
    res.status(500).send("Error deleting user: " + error.message);
  }
});

app.patch("/update/:userId", async (req, res) => {
  console.log("Update request body:", req.body);

  try {
    const userId = req.params.userId;
    const ALLOWED_UPDATES = [
      "firstName",
      "lastName",
      "password",
      "photoUrl",
      "skills",
      "about",
    ];
    const updates = Object.keys(req.body);
    if (!updates.every((update) => ALLOWED_UPDATES.includes(update))) {
      throw new Error("Invalid update fields");
    }
    await User.findByIdAndUpdate(userId, req.body, { runValidators: true });
    res.send("User updated successfully");
  } catch (error) {
    res.status(500).send("Error updating user: " + error.message);
  }
});

connectDB()
  .then(() => {
    console.log("Database connected successfully");
    app.listen(7777, () => {
      console.log("Server is running on port 7777");
    });
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
  });
