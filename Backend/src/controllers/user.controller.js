import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudnary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, resp) => {
  // resp.status(200).json({
  //   message: "Welcome to JS-Backend",
  // });

  /*
    get user details from frontend
    validations - not empty
    check if already exist -> username, email
    check for images, checck for avatars
    upload them in cloudinary, avatar
    create user in object -> create entry in database
    remove password and refresh token field from response
    check for user creation
    return response
  */

  const { fullName, email, username, password } = req.body;
  console.log("email:", email);

  if (
    [fullName, email, username, password].some((fiels) => fiels?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }
  const existedUser = User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with email or username alreaddy exist");
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar is required");
  }

  const avatar = await uploadOnCloudnary(avatarLocalPath);
  const coverImage = await uploadOnCloudnary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(400, "Avatar upload failed");
  }

  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  const createUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  if (!createUser) {
    throw new ApiError(404, "User not found");
  }
  return resp
    .status(201)
    .json(new ApiResponse(200, createUser, "User registered successfullly"));
});

export { registerUser };
