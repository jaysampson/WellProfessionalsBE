const express = require("express");
const {
  registerUser,
  userLogin,
  getAllUsers,
  getAUser,
  updateAUser,
  deleteUser,
  deleteManyUser,
  getManyUser,
  getMe,
  updatePassword,
  forgotpassword,
  resetPassword,
  updateAvatar,
} = require("../../controllers/userController");
const {
  authMiddleware,
  isAdmin,
} = require("../../middlewares/authMiddlewares");
const validateEmail = require("../../middlewares/emailValidation");
const storage = require("../../middlewares/multer");

const userRouter = express.Router();

//POST ROUTES
userRouter.post("/register", validateEmail, registerUser);
userRouter.post("/login", validateEmail, userLogin);
userRouter.post("/forgot-password", validateEmail, forgotpassword)

//GET ROUTES
userRouter.get("/all-users", authMiddleware, isAdmin, getAllUsers);
userRouter.get("/me", authMiddleware, getMe);
userRouter.get("/:id", authMiddleware, isAdmin, getAUser);

userRouter.put("/update-password", authMiddleware, updatePassword);
userRouter.put(
  "/update-user-avatar",
  authMiddleware,
  updateAvatar
);
userRouter.put("/reset-password/:token", resetPassword);

//PATCH ROUTES
userRouter.patch("/:id", authMiddleware, updateAUser);

//DELETE ROUTES
userRouter.delete("/:id", authMiddleware, isAdmin, deleteUser);
// userRouter.get("/get-all", authMiddleware, isAdmin, deleteManyUser);

module.exports = userRouter;
