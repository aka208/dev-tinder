const validator = require("validator");

const validateSignupRequest = (req) => {
  const { firstName, lastName, emailId, password } = req;
  if (!firstName || !lastName) {
    throw new Error("First name and last name are required");
  }
  if (!validator.isEmail(emailId)) {
    throw new Error("Invalid email ID");
  }
  if (!validator.isStrongPassword(password)) {
    throw new Error(
      "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one symbol",
    );
  }
};

module.exports = {
  validateSignupRequest,
};
