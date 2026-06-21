const connectDB = require("./config/database");
const express = require("express");
const cors = require("cors");

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const cookieParser = require("cookie-parser");
const userRouter = require("./routes/user");

const app = express();
// to set cookie we need to set withCredentials as true in frontend and cors config credentials as true in backend
app.use(
  cors({
    origin: "http://localhost:5173/",
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

connectDB()
  .then(() => {
    console.log("Database connected successfully");
    app.listen(7777, () => {
      console.log("Server is running on port 7777");
    });
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
  });
