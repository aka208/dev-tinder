const { createNextState } = require("@reduxjs/toolkit");
const mongoose = require("mongoose");

const connectionSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    toUserId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },

    status: {
      type: String,
      enum: {
        values: ["interested", "ignored", "accepted", "rejected"],
        message: `{VALUE} is not a valid status!`,
      },
    },
  },
  {
    timestamps: true,
  },
);
connectionSchema.pre("save", function (next) {
  const connectionSchema = this;
  if (connectionSchema.fromUserId.equals(connectionSchema.toUserId)) {
    throw new Error("Cannnot send request to same logged in user id.");
  }
  next();
});
const ConnectionRequest = new mongoose.model("connection", connectionSchema);

module.exports = ConnectionRequest;
