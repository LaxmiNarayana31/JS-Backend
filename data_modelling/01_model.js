import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "password is required"],
      minlength: 6,
    },
  },
  { timestamps: true }
);

export const User = mongoose("User", userSchema);

// User -> This is stored in database name as users
//  Whenever you give a model name in mongoose, when ever the data goes to mongoDB it converted to plural form and lowercase letters.
//  So, User -> users
