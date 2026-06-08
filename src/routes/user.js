const express = require("express");
const userRouter = express.Router();

const { userAuth } = require("../middlewares/userAuth");
const connectionRequest = require("../models/connectionRequest");

const USER_SAFE_DATA = "firstName lastName photoUrl skills age gender";

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const data = await connectionRequest
      .find({
        toUserId: loggedInUserId,
        status: "interested",
      })
      .populate("fromUserId", USER_SAFE_DATA);

    if (data.length === 0) {
      res.status(400).json({ message: "No data found" });
    }

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

    const userData = connectionRequest.map((connection) => {
      if (connection.fromUserId._id.toString() === loggedInUserId.toString()) {
        return connection.toUserId;
      }
      return connection.fromUserId;
    });

    res.json({ message: "Connections fetched", data: userData });
  } catch (error) {}
});
module.exports = userRouter;
