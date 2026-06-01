const express = require("express");
const app = express();

app.get("/user", (req, res) => {
  res.send(req.query);
  // res.send("User Get method");
});

app.get("/dynamicUser/:id/:name/:age", (req, res) => {
  res.send(req.params);
  // res.send("Dynamic User Get method");
});

app.post("/user", (req, res) => {
  res.send("User Post method");
});

app.put("/user", (req, res) => {
  res.send("User Put method");
});

app.patch("/user", (req, res) => {
  res.send("User Patch method");
});

app.delete("/user", (req, res) => {
  res.send("User Delete method");
});

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
