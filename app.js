require("dotenv").config();
require("express-async-errors");

const express = require("express");
const app = express();

const connectDB = require("./db/connect");
const authenticateUser = require("./middleware/authentication");
// routers
const authRouter = require("./routes/auth");
const jobsRouter = require("./routes/jobs");
const updateInfoRouter = require("./routes/updateInfo");
const updatepwRouter = require("./routes/updatepw");
const otpRouter = require("./routes/otp");
const forgotpwRouter = require("./routes/forgotpw");
const reportRouter = require("./routes/report");

// error handler
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

app.use(express.json());
app.use("/public", express.static("public"));

app.get("/", (req, res) => {
  res.send("<h1>Hello</h1>");
});

// routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/otp", otpRouter);
app.use("/api/v1/forgotpw", forgotpwRouter);
app.use("/api/v1/report", reportRouter);

// routes after login
app.use("/api/v1/jobs", authenticateUser, jobsRouter);
app.use("/api/v1/updateInfo", authenticateUser, updateInfoRouter);
app.use("/api/v1/updatepw", authenticateUser, updatepwRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`),
    );
  } catch (error) {
    console.log(error);
  }
};

start();
