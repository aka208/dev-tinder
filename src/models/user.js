const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  firstName: { type: String, maxlength: 20, required: true },
  lastName: { type: String, maxlength: 20 },
  emailId: {
    type: String,
    required: true,
    unique: true,
    validate: (value) => {
      if (!validator.isEmail(value)) {
        throw new Error("Invalid Email ID");
      }
    },
  },
  password: {
    type: String,
    validate: (value) => {
      if (!validator.isStrongPassword(value)) {
        throw new Error(
          "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one symbol",
        );
      }
    },
  },
  age: { type: Number, min: 18 },
  gender: { type: String },
  photoUrl: {
    type: String,
    default:
      "https://www.pngall.com/wp-content/uploads/5/Profile-PNG-High-Quality-Image.png",
    validate: (value) => {
      console.log("Validating photoUrl:", value);
      console.log("Is valid URL:", validator.isURL(value));
      if (!validator.isURL(value)) {
        throw new Error("Invalid Photo URL");
      }
    },
  },
  skills: {
    type: [String],
    validate: (value) => {
      if (
        !Array.isArray(value) &&
        value.some((skill) => typeof skill !== "string")
      ) {
        throw new Error("Skill should always be strings");
      }
    },
  },
  about: {
    type: String,
    maxlength: 500,
    default: "This is default description",
  },
});

// Helper functions -> to offload any complex logic from route handlers and controllers
userSchema.methods.getJwtToken = async function () {
  const user = this;
  const token = await jsonwebtoken.sign({ userId: user._id }, "secret@key", {
    expiresIn: "1h",
  });
  return token;
};

userSchema.methods.validatePassword = async function (password) {
  const user = this;
  const passwordHash = user.password;
  const isPasswordMatch = await bcrypt.compare(password, passwordHash);
  return isPasswordMatch;
};

const userModel = new mongoose.model("User", userSchema);

module.exports = userModel;
