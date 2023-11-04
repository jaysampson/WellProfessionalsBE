const { generateToken } = require("../../config/jwtToken");
const sendEmail = require("../../controllers/emailController");
const User = require("../../models/userModel");
const asynchandler = require("express-async-handler");
const crypto = require("crypto");
const { BadRequestError, UnauthenticatedError } = require("../../errors");
const cloudinary = require("../../config/cloudinary");

//REGISTER A NEW USER
const registerUser = asynchandler(async (req, res) => {
  const { email } = req.body;
  try {
    const findUser = await User.findOne({ email });
    if (findUser) {
      throw new BadRequestError("Email is already taken");
    } else {
      const newUser = await User.create(req.body);

      const { password, ...others } = newUser._doc;
      res.status(201).json({
        status: true,
        message: "User Created successfully",
        data: others,
      });
    }
  } catch (error) {
    throw new BadRequestError(error);
  }
});

//LOGIN A USER
const userLogin = asynchandler(async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);
  if (!email || !password) {
    throw new BadRequestError("Please enter email and password");
  }
  // check if user exist or not
  const findUser = await User.findOne({ email });
  if (findUser && (await findUser.isPasswordMatched(password))) {
    const { password, ...others } = findUser._doc;
    res.status(200).json({
      status: true,
      message: "Logged in successfully",
      token: generateToken(findUser?._id),
      data: others,
    });
  } else {
    throw new UnauthenticatedError("Wrong credentials");

    // res.status(401).json(error, {
    //   status: false,
    //   message: `Wrong credentials`,
    // });
  }
});

const getMe = asynchandler(async (req, res) => {
  const user = req.user;
  // console.log(user,"user")
 
  if (!user) throw new BadRequestError("User not found");
  const { password, ...others } = user._doc;
  res.status(200).json({
    status: true,
    message: "success",
    others,
    token: generateToken(others._id),
  });
});

//GET ALL USERS
const getAllUsers = asynchandler(async (req, res) => {
  try {
    const usersData = await User.find().select("-password");
    // const findAllIds = usersData.map((item) => item._id);
    // console.log(findAllIds, "userDAta");

    res.status(200).json({
      status: true,
      message: "success",
      count: usersData.length,
      usersData,
    });
  } catch (error) {
    throw new BadRequestError("Could not fetch all users");
  }
});

// GET A USER
const getAUser = asynchandler(async (req, res) => {
  const { id } = req.params;

  try {
    if (id === req.user.id || req.user.roles === "admin") {
      const findOneUser = await User.findById({ _id: id });
      if (!findOneUser) {
        throw new BadRequestError("User not found");
      } else {
        const { password, ...others } = findOneUser._doc;
        res.status(200).json({
          status: true,
          message: "success",
          data: others,
        });
      }
    } else {
      throw new UnauthenticatedError("Not authorized to access this route");
      // res.status(401).json({
      //   status: false,
      //   message: "Not authorized to access this route",
      // });
    }
  } catch (error) {
    throw new BadRequestError(error);
  }
});

//Get
const getAUser2 = asynchandler(async (req, res) => {
  const { id } = req.params;
  const { _id } = req.user;

  try {
    const checkUserId = await User.findOne(_id);

    console.log(checkUserId, "checkUserId");

    if (checkUserId === req.params.id) {
      res.status(400).json("you only get yourself");
    } else {
      const findOneUser = await User.findById(id);
      const { password, ...others } = findOneUser._doc;
      res.status(200).json({
        status: true,
        message: "success",
        data: others,
      });
    }
  } catch (error) {
    throw new BadRequestError(error);
  }
});

//UPDATE A USER
const updateAUser = asynchandler(async (req, res) => {
  const { id } = req.params;
  const { image } = req.body;
  // const { _id } = req.user;
  // console.log(String(req.user._id) === id, "req.user");
  // console.log(String(req.user._id), "String(req.user._id)");
  // console.log(id, "id");

  try {
    if (id === req.user.id) {
      if (image) {
      }
      const user = await User.findByIdAndUpdate(id, req.body, { new: true });
      // await redis.set(user.id, JSON.stringify(user));
      const { password, ...others } = user._doc;

      res.status(200).json({
        status: true,
        message: "User profile updated successfully",
        data: others,
      });
    } else {
      throw new UnauthenticatedError(
        `Not authorized to access this user's Profile`
      );
    }
  } catch (error) {
    throw new UnauthenticatedError(
      "Not authorized to access this user's Profile",
      error
    );
  }
});

//UPDATE AVATAR
const updateAvatar = asynchandler(async (req, res) => {

  

  const { image } = req.body;
  const _id = req.user;
  try {
    const user = await User.findById(_id);

    if (image && user) {
      if (user?.image?.public_id) {
        await cloudinary.uploader.destroy(user?.image.public_id);

        const myCloud = await cloudinary.uploader.upload(req.file.path, {
          folder: "avatars",
          width: 150,
        });
        console.log(myCloud, "OBJECT");
        user.image = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
      } else {
        const myCloud = await cloudinary.uploader.upload(req.file.path, {
          folder: "avatars",
          width: 150,
        });
        console.log(myCloud, "myCloud");
        user.image = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
      }
    }
    const { password, ...others } = user._doc;
    await user.save();
    res.status(200).json({
      status: true,
      message: "profile picture updated successfully",
      user,
    });

    // await redis.set(user._id, JSON.stringify(user))
  } catch (error) {
    throw new BadRequestError(error);
  }
});

//UPDATE A PASSWORD

const updatePassword = asynchandler(async (req, res) => {
  const _id = req.user;
  const { password } = req.body;

  try {
    const user = await User.findById(_id);
    if (user && password && (await user.isPasswordMatched(password))) {
      throw new BadRequestError("Please enter a new password");
    } else {
      user.password = password;
      await user.save();
      res
        .status(200)
        .json({ status: true, message: "Password updated successfully" });
    }
  } catch (error) {
    throw new BadRequestError(error);
  }
});

//FORGOT PASSWORD
const forgotpassword = asynchandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) throw new BadRequestError(`No user with this email`);
  try {
    const token = await user.createPasswordTokenReset();
    console.log(token, user, "token");
    await user.save();
    const resetlink = `http://localhost:8080/api/user/reset-password/${token}`;
    const data = {
      to: email,
      text: `Hey ${user.name}`,
      subject: "Reset Password",
      html: resetlink,
    };

    sendEmail(data);
    res.status(200).json(resetlink);
  } catch (error) {
    throw new BadRequestError(error);
  }
});

//RESET PASSWORD
const resetPassword = asynchandler(async (req, res) => {
  const { password } = req.body;
  const { token } = req.params;
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpire: { $gt: Date.now() },
  });
  if (!user) throw new BadRequestError("Token Expired, Please try again");
  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpire = undefined;
  await user.save();
  res
    .status(200)
    .json({ status: true, message: "Password reset successfully" });
});

// DELETE A USER
const deleteUser = asynchandler(async (req, res) => {
  const { id } = req.params;
  console.log(req.params.id);
  try {
    const DeleteUser = await User.findByIdAndDelete({ _id: id });
    if (!DeleteUser) {
      throw new BadRequestError(`${id} deleted already`);
    } else {
      res
        .status(200)
        .json({ status: "true", message: "User deleted successfully" });
    }
  } catch (error) {
    throw new BadRequestError(error);
  }
});

const getManyUser = asynchandler(async (req, res) => {
  // const id = req.params.id.split(",");
  //    console.log(req.params.id, "fffffff");

  try {
    const user = await User.find();
    const userIds = user.map((item) => item._id);
    const newUserId = JSON.stringify(userIds);

    res.json(user);
  } catch (error) {
    throw new BadRequestError("Could not fetch all users");
  }
});

module.exports = {
  registerUser,
  userLogin,
  getAllUsers,
  getAUser,
  updateAUser,
  deleteUser,
  getManyUser,
  getMe,
  updatePassword,
  forgotpassword,
  resetPassword,
  updateAvatar,
  // deleteManyUser,
};
