const express = require("express");
const app = express();
const { adminAuth, productAuth } = require("./middlewares/adminAuth");

app.use("/admin", adminAuth);

app.get("/admin/getAllData", (req, res) => {
  res.send("Admin data: All data");
});

app.use("/product", productAuth);

app.get("/product/getAllProducts", (req, res) => {
  res.send("Product data: All products");
});

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

// Multiple Request handlers
app.use(
  "/multipleHandlers",
  (req, res, next) => {
    console.log("First handler");
    next();
  },
  (req, res, next) => {
    console.log("Second handler");
    res.send("Multiple handlers executed");
  },
);

// ways of passing mutliple handlers
app.use("/multipleHandlersArray", [
  (req, res, next) => {
    console.log("First handler in array");
    next();
  },
  (req, res, next) => {
    console.log("Second handler in array");
    res.send("Multiple handlers in array executed");
  },
]);

// error if res.send() is executed before next() in the first handler, because res.send() ends the response and next() will execute RH2 when response is already sent, which will cause an error
// app.use(
//   "/errorSend",
//   (req, res, next) => {
//     res.send("This will cause an error");
//     next();
//   },
//   (req, res) => {
//     console.log(
//       "This will not be executed due to the error in the previous handler",
//     );
//     res.send("This will not be sent");
//   },
// );

app.listen(7777, () => {
  console.log("Server is running on port 7777");
});
