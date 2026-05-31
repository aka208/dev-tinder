const express = require("express");
const app = express();

app.use("/hello", (req, res) => {
  res.send("Hello to the World!");
});

app.use("/testHello", (req, res) => {
  res.send("Hello World");
});

app.use("/profile", (req, res) => {
  res.send("This page has user details.");
});

app.use("/userRequests", (req, res) => {
  res.send("This page has user requests.");
});

app.listen(7777, () => {
  console.log("Server is running on port 7777");
});
