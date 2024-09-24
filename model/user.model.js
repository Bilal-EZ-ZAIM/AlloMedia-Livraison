const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "name required"],
      minlength: [2, "Name must be at least 2 characters long"],
      maxlength: [50, "Name must be less than 50 characters"],
    },
    slug: {
      type: String,
      trim: true,
      required: [true, "slug required"],
      minlength: [2, "Slug must be at least 2 characters long"],
      maxlength: [50, "Slug must be less than 50 characters"],
    },
    email: {
      type: String,
      trim: true,
      required: [true, "email required"],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Please provide a valid email"],
    },
    phone: {
      type: String,
      trim: true,
      required: [true, "Phone is required"],
      unique: true,
    },
    imgProfile: {
      type: String,
      default: "default.jpg",
    },
    password: {
      type: String,
      trim: true,
      required: [true, "password required"],
      minlength: [8, "Password must be at least 8 characters long"],
    },
    passwordChangedAt: Date,
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
  },
  {
    timestamps: true,
  }
);

const UserModel = mongoose.model("User", UserSchema);

module.exports = UserModel;
