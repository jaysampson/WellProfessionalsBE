const express = require("express");

const {
  authMiddleware,
  isAdmin,
  isInstructor,
  isBoth,
} = require("../../middlewares/authMiddlewares");
const validateEmail = require("../../middlewares/emailValidation");
const {
  createCourseCategory,
  getAllCoursesCategory,
  updateACourseCategory,
  getACourseCategory,
  deleteACourseCategory,
} = require("../../controllers/courseController/courseCategory");

const courseCatRouter = express.Router();

// COURSES CATEGORY ROUTES
courseCatRouter.post("/", authMiddleware, isAdmin, createCourseCategory);
courseCatRouter.put("/:id", authMiddleware, isAdmin, updateACourseCategory);
courseCatRouter.get("/all-categories", authMiddleware, getAllCoursesCategory);
courseCatRouter.get("/:id", authMiddleware, getACourseCategory);
courseCatRouter.delete("/:id", authMiddleware, isAdmin, deleteACourseCategory);

module.exports = courseCatRouter;
