const mongoose = require("mongoose");

const LessonSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      unique: true,
      minLength: 3,
      maxLenght: 400,
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
    courseId:{
      type:mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
    
    content: {
      type: Object,
      minlength: 200,
    },
    video: {
      type: String,
    },
    free_preview: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Lesson", LessonSchema);