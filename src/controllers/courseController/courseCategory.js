const { default: slugify } = require("slugify");
const CourseCategory = require("../../models/courseCatModel");
const asynchandler = require("express-async-handler");
const { BadRequestError } = require("../../errors");

// const slugify = require("slugify");

const createCourseCategory = asynchandler(async (req, res) => {
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title.toLowerCase());
      const createCategory = await CourseCategory.create(req.body);
      res.status(200).json({
        status: true,
        message: "Course category created successfully",
        result: createCategory,
      });
    }
  } catch (error) {
    throw new BadRequestError(error);
  }
});

//get all tutorial category

const getAllCoursesCategory = asynchandler(async (req, res) => {
  try {
    const getAllcategories = await CourseCategory.find();
    res.status(200).json({
      status: true,
      message: "Course Categories successfully",
      getAllcategories,
    });
  } catch (error) {
    throw new BadRequestError(error);
  }
});
//update a category

const updateACourseCategory = asynchandler(async (req, res) => {
  const { id } = req.params;
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title.toLowerCase());
      const updateACategoryData = await CourseCategory.findByIdAndUpdate(
        id,
        req.body,
        { new: true }
      );
      res.status(200).json({
        status: true,
        message: "Course Category Updated Successfully",
        updateACategoryData,
      });
    }
  } catch (error) {
    throw new BadRequestError(error);
  }
});

//get a category
const getACourseCategory = asynchandler(async (req, res) => {
  const { id } = req.params;
  console.log(id, "cat Id");
  try {
    const getACategoryData = await CourseCategory.findById(id);
    res.status(200).json({
      status: true,
      message: "Course Category Successfully",
      getACategoryData,
    });
  } catch (error) {
    throw new BadRequestError(error);
  }
});
//Delete a category
const deleteACourseCategory = asynchandler(async (req, res) => {
  const { id } = req.params;
  try {
    const deleteCategoryData = await CourseCategory.findByIdAndDelete(id);
    res.status(200).json({
      status: true,
      message: "Course Category Deleted Successfully",
    //   deleteCategoryData,
    });
  } catch (error) {
    throw new BadRequestError(error);
  }
});

module.exports = {
  createCourseCategory,
  getAllCoursesCategory,
  updateACourseCategory,
  getACourseCategory,
  deleteACourseCategory,
};
