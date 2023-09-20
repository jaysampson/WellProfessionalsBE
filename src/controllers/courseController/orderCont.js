const { default: slugify } = require("slugify");
const dotenv = require("dotenv");
dotenv.config();
const { BadRequestError } = require("../../errors");
const Course = require("../../models/courseModel");
const OrderModel = require("../../models/orderModel");
const NotificationModel = require("../../models/notificationModel");
const User = require("../../models/userModel");
const asynchandler = require("express-async-handler");
const sendMail = require("../emailController");

const createOrder = asynchandler(async (req, res) => {
  try {
    const { courseId, payment_info } = req.body;
    const user = await User.findById(req.user._id);

    const courseExistInUser = user.courses.some(
      (course) => course.id.toString() === courseId
    );
    if (courseExistInUser) {
      throw new Error("You have already purchased this course", 400);
    }

    const course = await Course.findById(courseId);
    if (!course) {
      throw new Error("Course not found", 404);
    }

    const data = {
      userId: user._id,
      courseId: course._id,
      payment_info,
    };

    // const mailData = {
    //   to: user.email,
    //   text: `Hey ${user.name}`,
    //   subject:'Payment Confirmation',
    //   html: {
    //     _id: course._id.toString().slice(0, 6),
    //     name: course.name,
    //     price: course.price,
    //     date: new Date().toLocaleDateString("en-US", {
    //       year: "numeric",
    //       month: "long",
    //       day: "numeric",
    //     }),
    //   },
    // };
    // sendMail(mailData)

    user?.courses.push(course._id);

    await user?.save();

    await NotificationModel.create({
      user: user._id,
      title: "New order",
      message: `Your  new order from ${course.name}`,
    });

    course.purchased +=1; 
    await course.save();

    const order = await OrderModel.create(data);
    res.status(201).json({
      status: true,
      message: "order created successfully",
      order,
      course,
    });
  } catch (error) {
    throw new BadRequestError(error);
  }
});

module.exports = {
  createOrder,
};
