const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const CourseCatSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("courseCategory", CourseCatSchema);


// const express = require("express");
// const Course = require("../../models/courseModels/courseModel");
// const asynchandler = require("express-async-handler");

// const createCourseService = asynchandler(async (data, req, res) => {
//   const course = Course.create(data);
//   res.status(201).json({
//     status: true,
//     message: "Course created successfully",
//     course,
//   });
// });
// module.exports = createCourseService;