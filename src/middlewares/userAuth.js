const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      throw new Error("Unauthorized");
    }
    const verifiedToken = jwt.verify(token, "secret@key");
    if (!verifiedToken) {
      throw new Error("Unauthorized");
    }
    req.userId = verifiedToken.userId;
    const user = await User.findById(req.userId);
    req.user = user;
    next();
  } catch (error) {
    res.status(401).send("Invalid or expired token");
  }
};
module.exports = { userAuth };
