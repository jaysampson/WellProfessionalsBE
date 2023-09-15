const express = require("express");
const dbConnect = require("./src/config/dbConfig");
const cors = require("cors");
const bodyParser = require("body-parser");
const userRouter = require("./src/routes/userRoutes/index");
const {
  handlerError,
  notFoundError,
  ErrorHandler,
} = require("./src/middlewares/errorHandles");
const courseCatRouter = require("./src/routes/courseCatRoutes");
const courseRouter = require("./src/routes/courseRoutes");
const { stripeRouter } = require("./src/routes/stripeRoutes");
require("dotenv").config();

// dbConnect();
const app = express();
const PORT = process.env.PORT || 4040;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.send("hello well professional server ");
});

//DEFINE ROUTES
app.use("/api/user", userRouter);
app.use("/api/course/category", courseCatRouter);
app.use("/api/course", courseRouter);
app.use("/api/stripe", stripeRouter);

//DEFINE GLOBAL ERRORS
// app.use(ErrorHandler)
app.use(handlerError);
app.use(notFoundError);

const start = async () => {
  try {
    await dbConnect();
    app.listen(
      PORT,
      console.log(`Server is Running at http://localhost:${PORT}`)
    );
  } catch (error) {
    console.log(error);
  }
};
start();
