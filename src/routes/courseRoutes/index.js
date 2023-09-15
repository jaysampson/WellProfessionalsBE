const express = require("express");
const {
  authMiddleware,
  isAdmin,
  isInstructor,
  isBoth,
} = require("../../middlewares/authMiddlewares");
const {
  createCourse,
  getAllCourses,
  updateACourse,
  getACourse,
  getACourseByCategory,
  deleteACourse,
  addRating,
  uploadCourseVideo,
  getSingleWithoutSubCourse,
  getAllCoursesWithoutSub,
  getCourseContentToValidUser,
  createCourseQuestion,
  answerQuestion,
} = require("../../controllers/courseController/courseController");
const {
  createLesson,
  deleteALesson,
  getAlesson,
  getAllLesson,
  getAllLesson2,
  getAllCourseLesson,
  getAllLessonModel,
} = require("../../controllers/courseController/lessonController");
const storage = require("../../middlewares/multer");
const upload = require("../../middlewares/multer");
const courseRouter = express.Router();

// COURSES ROUTES
courseRouter.post("/", authMiddleware, isAdmin, createCourse);
// courseRouter.post("/:courseId/add-rating", authMiddleware, addRating);
courseRouter.patch("/edit-course/:id", authMiddleware,isAdmin, updateACourse);
courseRouter.put(
  "/video-upload/:courseId",
  upload.single("file"),
  authMiddleware,
  uploadCourseVideo
);
courseRouter.get("/", authMiddleware, getAllCoursesWithoutSub);
courseRouter.get("/:id", authMiddleware, getSingleWithoutSubCourse);
courseRouter.get("/get-user-course-content/:id",authMiddleware, getCourseContentToValidUser);
courseRouter.delete("/:id", authMiddleware, isAdmin, deleteACourse);

//COURSE QUESTIONS
courseRouter.put("/add-question",authMiddleware, createCourseQuestion);
courseRouter.put("/add-answer", authMiddleware, answerQuestion);


// LESSON ROUTES
courseRouter.post("/lesson/:courseId", authMiddleware, isAdmin, createLesson);
courseRouter.delete(
  "/lesson/:courseId/:lessonId",
  authMiddleware,
  isAdmin,
  deleteALesson
);
courseRouter.get("/lesson/:id", authMiddleware, getAlesson);
courseRouter.get("/lessons/:courseId", authMiddleware, getAllCourseLesson);

//test
courseRouter.get("/lessions", authMiddleware, getAllLessonModel);

module.exports = courseRouter;
