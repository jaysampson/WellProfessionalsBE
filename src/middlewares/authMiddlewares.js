const User = require("../models/userModels/authUserModel");
const jwt = require("jsonwebtoken");
const asynchandler = require("express-async-handler");
const { UnauthenticatedError } = require("../errors");

const authMiddleware = asynchandler(async (req, res, next) => {
  let token;
  if (req?.headers?.authorization?.startsWith("Bearer")) {
    token = req?.headers?.authorization?.split(" ")[1];
    try {
      if (token) {
        const decode = jwt.verify(token, process.env.JWT_SECERT);
        const user = await User.findById(decode.id);
        req.user = user;

        next();
      }
    } catch (error) {
      throw new UnauthenticatedError(
        "Not authorized, please login again",
        error
      );
    }
  } else {
    throw new UnauthenticatedError("No token attached to the header...");
  }
});

// const authMiddleware = asynchandler(async (req, res, next) => {
//   const authHeader = req.headers.authorization;

//   if (!authHeader || !authHeader.startsWith("Bearer ")) {
//     throw new UnauthenticatedError("No token provided");
//   }

//   const token = authHeader.split(" ")[1];

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const { id, username } = decoded;
//     req.user = { id, username };
//     next();
//   } catch (error) {
//     throw new UnauthenticatedError("Not authorized to access this route");
//   }
// });

// ADMIN MIDDLEWARE
const isAdmin = asynchandler(async (req, res, next) => {
  const { email } = req.user;

  const adminRole = await User.findOne({ email });
  console.log(adminRole.roles !== "admin", "isAdmin");

  if (adminRole.roles !== "admin") {
    throw new UnauthenticatedError("You not an admin");
  } else {
    next();
  }
});

// INSTRUCTOR MIDDLEWARE
const isInstructor = asynchandler(async (req, res, next) => {
  const { email } = req.user;

  const instructorRole = await User.findOne({ email });

  if (instructorRole.roles !== "admin") {
    throw new UnauthenticatedError("You not an admin");
  } else {
    next();
  }
});

const isBoth = asynchandler(async (req, res) => {
  const { email } = req.user;

  const isAdminAndInstructor = await User.findOne({ email: email });

  if (
    (isAdminAndInstructor.roles !== "admin" ||
    isAdminAndInstructor.roles !== "instructor") === false
  ) {
    throw new UnauthenticatedError("You not authorized");
  } else {
    next();
  }
});

module.exports = { authMiddleware, isAdmin, isInstructor, isBoth };
