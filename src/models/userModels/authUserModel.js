const mongoose = require("mongoose"); // Erase if already required
const bcrypt = require("bcrypt");
const crypto = require("crypto");

// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    country_Code: {
      type: String,
      required: true,
      default: "+234",
    },
    mobile: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    roles: {
      type: String,
      default: "user",
    },
    
    image: {
      public_id: String,
      url: String,
    },
    courses: [
      {
        course_id: String,
      },
    ],
    isVerified: {
      type: Boolean,
      default: false,
    },

    user_profession: {
      type: String,
      require: true,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    passwordChangedAt: { type: Date },
    passwordResetToken: { type: String },
    passwordResetExpire: { type: Date },
    stripe_account_id: { type: String },
    stripe_sller: {},
    stripeSession: {},
  },
  {
    timestamps: true,
  }
);
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.isPasswordMatched = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};
userSchema.methods.createPasswordTokenReset = async function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetExpire = Date.now() + 30 * 60 * 1000; // 10 minutes
  return resetToken;
};

//Export the model
module.exports = mongoose.model("User", userSchema);
