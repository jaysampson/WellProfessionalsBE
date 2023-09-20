const { default: slugify } = require("slugify");
const { BadRequestError } = require("../../errors");
const Course = require("../../models/courseModel");
const Lesson = require("../../models/lessonModel");
const asynchandler = require("express-async-handler");
const { find } = require("../../models/userModel");

//CREATE LESSONS ENDPOINT

const createLesson = asynchandler(async (req, res) => {
  const { courseId } = req.params;
  try {
    const findCourse = await Course.findById(courseId);
    if (findCourse) {
      if (req.body.title) {
        req.body.slug = slugify(req.body.title.toLowerCase());
      }
      const lesson = await Lesson.create(req.body);
      const course = await Course.findByIdAndUpdate(
        courseId,
        { $push: { lessons: lesson } },
        { new: true }
      );
      res.status(201).json({
        status: true,
        message: " Lesson created Successfully",
        lesson,
        course,
      });
    } else {
      throw new BadRequestError("No Course Exist with this ID");
    }
  } catch (error) {
    throw new BadRequestError(error);
  }
});

//GET A LESSON
const getAlesson = asynchandler(async (req, res)=>{
    const {courseId, lessonId} = req.params;
    try {
        const lesson = await Lesson.findOne({ lesson: lessonId });
         res.status(201).json({
           status: true,
           message: " Lesson created Successfully",
           lesson,
         });
    } catch (error) {
        throw new BadRequestError(error)
        
    }
})
//GET ALL CATEGORY LESSON
const getAllCourseLesson = asynchandler(async (req, res)=>{
    const {courseId} = req.params;
    try {
        const lesson = await Course.find().where({_id: courseId}).select("lessons");
         res.status(201).json({
           status: true,
           message: "Successfully",
           lesson,
         });
    } catch (error) {
        throw new BadRequestError(error)
        
    }
})

//GET ALL LESSON
const getAllLessonModel =asynchandler(async(req, res) =>{

    try {
        const course = await Course.find()
        console.log(course)
        res.status(200).json({ status: "true", course });
    } catch (error) {
        throw new BadRequestError(error);

        
    }

})




//DELETE A LESSON
const deleteALesson = asynchandler(async (req, res) => {
  const { courseId, lessonId } = req.params;
  try {
    const findCourse = await Course.findByIdAndUpdate(
      courseId,
      { $pull: { lessons: lessonId } },
      { new: true }
    );
    const deleteLesson = await Lesson.findByIdAndDelete(lessonId);
    res.status(201).json({
      status: true,
      message: "Lesson deleted Successfully",
    });
  } catch (error) {
    throw new BadRequestError(error);
  }
});

module.exports = {
  createLesson,
  deleteALesson,
  getAlesson,
  getAllCourseLesson,
  getAllLessonModel,
};
