const express = require("express");
const userRouter = express.Router();

const { userAuth } = require("../middlewares/userAuth");
const connectionRequest = require("../models/connectionRequest");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const USER_SAFE_DATA = "firstName lastName about photoUrl skills age gender";

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const data = await connectionRequest
      .find({
        toUserId: loggedInUserId,
        status: "interested",
      })
      .populate("fromUserId", USER_SAFE_DATA);

    // if (data.length === 0) {
    //   res.json({ message: "No data found" });
    // }

    res.json({ message: "Requests fetched", data });
  } catch (error) {
    res.status(400).json({ message: "Something went wrong" });
  }
});
userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const connections = await connectionRequest
      .find({
        $or: [
          {
            fromUserId: loggedInUserId,
            status: "accepted",
          },
          { toUserId: loggedInUserId, status: "accepted" },
        ],
      })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);
    console.log("CON", connections);

    const userData = connections.map((connection) => {
      if (connection.fromUserId._id.toString() === loggedInUserId.toString()) {
        return connection.toUserId;
      }
      return connection.fromUserId;
    });
    console.log("USER", userData);

    res.json({ message: "Connections fetched", data: userData });
  } catch (error) {
    res.status(400).json({ message: error });
  }
});
userRouter.get("/user/feed", userAuth, async (req, res) => {
  try {
    const page = req.query.page;
    let limit = req.query.limit;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;
    const loggedInUserId = req.user._id;
    const connections = await connectionRequest
      .find({
        $or: [{ fromUserId: loggedInUserId }, { toUserId: loggedInUserId }],
      })
      .select("fromUserId toUserId");
    const hideUsers = new Set();
    connections.forEach((c) => {
      hideUsers.add(c.fromUserId.toString());
      hideUsers.add(c.toUserId.toString());
    });
    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUsers) } },
        { _id: { $ne: loggedInUserId } },
      ],
    })
      .select(USER_SAFE_DATA)
      .skip(skip)
      .limit(limit);

    res.json({ message: "User Feeds", data: users });
  } catch (error) {
    res.status(400).json({ message: error });
  }
});
module.exports = userRouter;
