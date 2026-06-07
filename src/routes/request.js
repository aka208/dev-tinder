const express = require("express");
const requestRouter = express.Router();

const { userAuth } = require("../middlewares/userAuth");

const { ConnectionDb } = require("../models/connectionRequest");
const { Connection } = require("mongoose");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

requestRouter.get("/sendConnections", userAuth, async (req, res) => {
  try {
    // const user = req.user;
    res.send("Connection request sent!!");
  } catch (error) {
    res.status(500).send("Error fetching profile: " + error.message);
  }
});
requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params?.toUserId;
      const status = req.params?.status;
      const reqObj = req.body;
      const ALLOWED_STATUS = ["interested", "ignored"];
      const isAllowed = ALLOWED_STATUS.includes(status);
      // check if status is allowed
      if (!isAllowed) {
        return res.status(400).json({ message: "Invalid status." });
      }

      // check if connection request already exists
      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          {
            fromUserId: toUserId,
            toUserId: fromUserId,
          },
        ],
      });
      // check if toUserId is exists or not
      const toUserExists = await User.findById(toUserId);
      if (!toUserExists) {
        return res
          .status(404)
          .json({ message: "User is not there in db to connect!" });
      }
      //---------------------------------------------------
      // check if sender and receiver's id is same using PRE in schema
      // --------------------------------------------------
      if (existingConnectionRequest) {
        return res
          .status(400)
          .json({ message: "Connection request already exist!" });
      }

      if (!toUserId) {
        throw new Error("No userId to send request");
      }
      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });
      const data = await connectionRequest.save();
      if (!data) {
        throw new Error("Error in Query");
      }
      res.json({ message: "Request sent.", data });
    } catch (error) {
      console.log(error);
      res.status(400).send("Error: " + error.message);
    }
  },
);

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUserId = req.user._id;

      const status = req.params.status;
      const requestId = req.params.requestId;
      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({ message: "Not a valid status!" });
      }

      if (connection.toUserId != loggedInUserId) {
        return res
          .status(400)
          .send("Logged In User id do not match with reciever user id.");
      }
      const connection = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUserId,
        status: "interested",
      });
      if (connection.toUserId != loggedInUserId) {
        return res
          .status(400)
          .send({
            message: "Logged In User id do not match with reciever user id.",
          });
      }
      if (!connection) {
        throw new Error("No request id found!");
      }
      const data = await ConnectionRequest.save();
      res.status().send({ message: "Request accepted", data });
    } catch (error) {
      res.status(404).send("Error: ", error);
    }
  },
);

module.exports = requestRouter;
