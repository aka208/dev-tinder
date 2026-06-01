const adminAuth = (req, res, next) => {
  const token = "admin-token";
  const isAuthorized = token === "admin-token";
  if (!isAuthorized) {
    res.status(403).send("Not Authorized!");
  } else {
    next();
  }
};

const productAuth = (req, res, next) => {
  const token = "product-token";
  const isAuthorized = token === "product-token";
  if (!isAuthorized) {
    res.status(403).send("Not Authorized!");
  } else {
    next();
  }
};
module.exports = { adminAuth, productAuth };
