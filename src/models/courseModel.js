const mongoose = require("mongoose");

// const Schema = mongoose.Schema()
const reviewSchema = new mongoose.Schema({
  user: Object,
  ratings: {
    type: Number,
    default: 0,
  },
  comment: String,
  commentReplies: [Object],
});
const linkSchema = new mongoose.Schema({
  title: String,
  url: String,
});

const questionSchema = new mongoose.Schema({
  user: Object,
  question: String,
  questionReplies: [],
});

const lessonDataSchema = new mongoose.Schema({
  videoUrl: String,
  videoThunbnail: Object,
  title: String,
  videoSection: String,
  description: String,
  videoLength: Number,
  videoPlayer: String,
  links: [linkSchema],
  suggestion: String,
  questions: [questionSchema],
});

const CourseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: String,
      // required: true,
    },
    price: {
      type: Number,
      required: true,
      // default: 0,
    },
    estimatedPrice: {
      type: Number,
    },
    thumbnail: {
      url: String,
      public_id: String,
      // required: true
    },
    tags: {
      type: String,
      required: true,
    },
    level: {
      type: String,
      required: true,
    },
    demoUrl: {
      public_id: String,
      url: String,
      // type: String,
      // required: true,
    },
    benefits: [
      {
        title: String,
      },
    ],
    prerequisites: [
      {
        title: String,
      },
    ],
    review: [reviewSchema],
    lessonData: [lessonDataSchema],
    ratings: {
      type: Number,
      default: 0,
    },
    purchased: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("course", CourseSchema);

// slug: {
//   type: String,
//   required: true,
// },
//  image: {
//     type: String,
//     default: "",
//   },
//   category: {
//     type: String,
//     required: true,
//   },
//   published: {
//     type: Boolean,
//     default: false,
//   },
//   instructor: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//     required: true,
//   },
//   paid: {
//     type: Boolean,
//     default: false,
//   },
//   lessons: {
//     type: mongoose.Schema.Types.Array,
//     ref: "Lesson",
//   },

//   totalHours: {
//     type: String,
//     default: 0,
//   },
//   enrolls: {
//     type: String,
//     default: 0,
//   },
//   ratings: [
//     {
//       stars: { type: Number, minLength: 0, maxLenght: 5 },
//       comment: String,
//       postedBy: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "User",
//       },
//     },
//   ],
//   totalRatings: {
//     type: Number,
//     default: 0,
//   },
// }
