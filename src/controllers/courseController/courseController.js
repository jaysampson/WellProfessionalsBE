const { default: slugify } = require("slugify");
const dotenv = require("dotenv");
dotenv.config();
const { BadRequestError } = require("../../errors");
const Course = require("../../models/courseModels/courseModel");
const asynchandler = require("express-async-handler");
const cloudinary = require("../../config/cloudinary");
const sendMail = require("../../controllers/emailController");


//CREATE COURSE ENDPOINT
const createCourse = asynchandler(async (req, res) => {
  const { _id } = req.user;
  const data = req.body;
  try {
    if (_id) {
      data.instructor = _id;
    }
    //UPLOAD IMAGES
    const thumbnail = data.thumbnail;
    if (thumbnail) {
      const myCloud = await cloudinary.uploader.upload(thumbnail, {
        folder: "courses",
      });
      data.thumbnail = {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      };
    }
    //UPLOAD VIDEOS
    // const denoUrl = data.denoUrl;
    // if (denoUrl) {
    //   const mycloudVideo = await cloudinary.uploader.upload(denoUrl, {
    //     resource_type: "video",
    //     folder: "denoVideo",
    //   });
    //   data.denoUrl = {
    //     public_id: mycloudVideo.public_id,
    //     url: mycloudVideo.secure_url,
    //   };
    // }
    const course = await Course.create(data);
    res.status(201).json({
      status: true,
      message: "Course created successfully",
      course,
    });
  } catch (error) {
    throw new BadRequestError(error);
  }
});


//####################################################################
//UPLOAD VIDEO AND UPDATE

const uploadCourseVideo = asynchandler(async (req, res) => {
  const { demoUrl } = req.body;
  const { courseId } = req.params;
  console.log(demoUrl, "demojdss");
  try {
    const course = await Course.findById(courseId);
    console.log(course.demoUrl);
    console.log(req.file.path);
    if (course?.demoUrl?.public_id) {
      // if (course?.demoUrl?.public_id) {
      //   await cloudinary.uploader.destroy(course?.demoUrl.public_id);
      // }
      await cloudinary.uploader.destroy(course?.demoUrl.public_id);
      const result = await cloudinary.uploader.upload(req.file.path, {
        resource_type: "video",
        folder: "demoVideo",
      });
      course.demoUrl = {
        public_id: result.public_id,
        url: result.secure_url,
      };
    } else {
      const result = await cloudinary.uploader.upload(req.file.path, {
        resource_type: "video",
        folder: "demoVideo",
      });
      course.demoUrl = {
        public_id: result.public_id,
        url: result.secure_url,
      };
    }

    await course.save();
    res.status(200).json({
      status: true,
      message: "Course video updated successfully",
      course,
    });
  } catch (error) {
    console.log(error);
    throw new BadRequestError(error);
  }
});

// ####################### GET ALL COURSES by Admin ########################

const getAllCourseByAdmin = asynchandler(async(req, res)=>{

})


// ####################### GET ALL COURSES with out sub ########################

const getAllCoursesWithoutSub = asynchandler(async (req, res) => {
  const { category } = req.query;

  let queryObject = {};
  if (category) {
    queryObject.category = category;
  }
  try {
    const getCourse = await Course.find(queryObject).select(
      "-courseData.videoUrl -courseData.description -courseData.links -courseData.questions -courseData.links -courseData.videoSection"
    );
    res.status(201).json({
      status: true,
      message: "Successfully",
      nbHits: getCourse.length,
      getCourse,
    });
  } catch (error) {
    throw new BadRequestError(error);
  }

  
});

//###################### GET A COURSE WITHout PURCHASING #####################

const getSingleWithoutSubCourse = asynchandler(async (req, res) => {
  try {
    const courseId = req.params.id;

      const course = await Course.findById(req.params.id).select(
        "-courseData.videoUrl -courseData.description -courseData.links -courseData.questions -courseData.links -courseData.videoSection"
      );

      res.status(200).json({
        status: true,
        message: "Successfully",
        course,
      });
  } catch (error) {
    throw new BadRequestError(error);
  }
});

// #####################UPDATE A COURSE ######################

const updateACourse = asynchandler(async (req, res) => {
  const data = req.body;
  const { id } = req.params;
  const thumbnail = data.thumbnail;

  try {
    if (thumbnail) {
      await cloudinary.uploader.destroy(thumbnail.public_id);

      const myCloud = await cloudinary.uploader.upload(thumbnail, {
        folder: "courses",
      });
      data.thumbnail = {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      };
    }
    const course = await Course.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true }
    );
    res.status(201).json({
      status: true,
      message: "Course updated successfully",
      course,
    });
  } catch (error) {
    throw new BadRequestError(error);
  }
});

// ##################### DELETE A COURSE ######################
const deleteACourse = asynchandler(async (req, res) => {
  const { id } = req.params;
  try {
    await Course.findByIdAndUpdate(id);
    res.status(200).json({
      status: true,
      message: " Course Deleted Successfully",
    });
  } catch (error) {
    throw new BadRequestError(error);
  }
});

// ######################## get course content  only for valid user ############

const getCourseContentToValidUser = asynchandler(async (req, res) => {
  try {
    const userCourseList = req.user?.courses;
    // console.log(userCourseList, "userCourseList");
    const courseId = req.params.id;

    const courseExists = userCourseList?.find(
      (course) => course._id.toString() === courseId
    );
    if (!courseExists) {
      throw new Error("You are not allow to access this course", 404);
    }

    const course = await Course.findById(courseId);
    const content = course?.courseData;
    res.status(200).json({
      status: true,
      message: "Successfully",
      content,
    });
  } catch (error) {
    throw new BadRequestError(error);
  }
});

// ################# add Questions ######################

const createCourseQuestion = asynchandler(async (req, res) => {
  const { question, courseId, contentId } = req.body;
  try {
    const course = await Course.findById(courseId);
    // console.log(course, "ppppppppppppp");
    courseContent = course?.courseData?.find((item) => item.id === contentId);
    console.log(courseContent, "courseContent");

    if (!courseContent) {
      throw new Error("invalid content Id", 400);
    }
    const { password, ...others } = req.user._doc;
    const newQuestion = {
      user: others,
      question,
      questionReplies: [],
    };

    courseContent?.questions?.push(newQuestion);
    await course?.save();

    res.status(200).json({
      status: true,
      message: "Successfully",
      course,
    });
  } catch (error) {
    throw new BadRequestError(error);
  }
});

const answerQuestion = asynchandler(async (req, res) => {
  const { auswer, courseId, contentId, questionId } = req.body;
  try {
    const course = await Course.findById(courseId);

    courseContent = course?.courseData?.find((item) => item.id === contentId);

    if (!courseContent) {
      throw new Error("invalid content Id", 400);
    }
    const question = courseContent?.questions.find(
      (item) => item.id === questionId
    );

    const { password, ...other } = req.user._doc;

    const newAnswer = {
      user: other._id,
      auswer,
    };
    if (!auswer) throw new Error("Answer is requried", 400);

    question?.questionReplies?.push(newAnswer);
    await course?.save();

    if (req.user?._id === question.user._id) {
      //create notifications
    } else {
      const data = {
        to: req.user.email,
        text: `Hey ${req.user.name}`,
        subject: courseContent.title,
      };
      sendMail(data);
    }

    res.status(200).json({
      status: true,
      message: "Successfully",
      course,
    });
  } catch (error) {
    throw new BadRequestError(error);
  }
});

// RATING AND STAR
// const addRating = asynchandler(async (req, res) => {
//   const { courseId } = req.params;
//   const { stars, comment } = req.body;

//   try {
//     const course = await Course.findById(courseId);
//     course.ratings.push({ stars, comment, postedBy: req.user });

//     // const totalRatings = course.ratings.reduce(
//     //   (sum, item) => sum + item.stars,
//     //   parseInt(0)
//     // );
//     // console.log(totalRatings, "totalRatings");
//     // course.totalRatings = totalRatings;

//     await course.save();
//     res.status(200).json({
//       status: true,
//       message: " Rating Added Successfully",
//       // newCourse,
//     });
//   } catch (error) {
//     throw new BadRequestError(error);
//   }
// });

module.exports = {
  createCourse,
  getAllCoursesWithoutSub,
  updateACourse,
  // getACourse,
  uploadCourseVideo,
  getSingleWithoutSubCourse,
  getCourseContentToValidUser,
  createCourseQuestion,
  answerQuestion,
  deleteACourse,
  // addRating,
};