import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw ApiError(500, "something went wrong");
  }
};

// register new user
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
  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with email or username already exist");
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;

  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

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

// login user
const loginUser = asyncHandler(async (req, resp) => {
  /*
  request body
  username or email
  find the user in database
  password check
  access and refresh token
  send cookies
  */
  const { email, username, password } = req.body;
  if (!username && !email) {
    throw new ApiError(400, "username or email required");
  }
  const user = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (!user) {
    throw new ApiError(404, "user does not exist");
  }
  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "invalid password");
  }
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  const loggedInUser = User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };
  return resp
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged in successfully"
      )
    );
});

// logout user
const logoutUser = asyncHandler(async (req, resp) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1 // this removes the field from document 
      },
    },
    {
      new: true,
    }
  );
  const options = {
    httpOnly: true,
    secure: true,
  };
  return resp
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "Logout Successfully"));
});

// make a new refresh token
const refreshAccessToken = asyncHandler(async (req, resp) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw ApiError(401, "Unauthorized request");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id);
    if (!user) {
      throw ApiError(401, "Invalid refresh token");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw ApiError(401, "Refresh token is expired or used");
    }

    const options = {
      httpOnly: true,
      secure: true,
    };

    const { accessToken, newRefreshToken } =
      await generateAccessAndRefreshToken(user._id);
    return resp
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access token refreshed successfully"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid access token");
  }
});


// change current password 
const changePassword = asyncHandler(async (req, resp) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;
  
  if (!(newPassword === confirmPassword)) {
    return ApiError(401, "newPassword and confimPassword field does not match")
  }

  const user = await User.findById(req.user?._id);
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

  if (!isPasswordCorrect) {
    throw ApiError(400, "Invalid Password")
  }

  user.password = newPassword
  await user.save({ validateBeforeSave: false })
  
  return resp
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"))
})


// get current user
const getCurrentUser = asyncHandler(async (req, resp) => {
  return resp
    .status(200)
    .json(new ApiResponse(200, {}, "Current user fetched successfully"))
})


// update user account details
const updateAccountDetails = asyncHandler(async (req, resp) => {
  const { fullName, email } = req.body;

  if (!fullName || !email) {
    throw ApiError(400, "All fields are required")
  }

  // find user
  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        fullName: fullName,
        email: email
      }
    },
    {new: true}
  ).select("-password")

  return resp
    .status(200)
    .json(new ApiResponse(200, user, "Account details updated successfully"))
})


// update user avatar(files)
const updateUserAvatar = asyncHandler(async (req, resp) => {
  const avatarLocalPath = req.file?.path

  if (!avatarLocalPath) {
    throw ApiError(400, "Avatar file missing")
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath)
    
  if (!avatar.url) {
    throw ApiError(400, "Error while uploading avatar")
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        avatar: avatar.url
      }
    },
    {new: true}
  ).select("-password")

  return resp
  .status(200)
  .json(new ApiResponse(200, user, "User avatar updated successfully"))

})


// update user cover image
const updateUserCoverImage = asyncHandler(async (req, resp) => {
  const coverImageLocalPath = req.file?.path

  if (!coverImageLocalPath) {
    throw ApiError(400, "CoverImage file missing")
  }

  const coverImage = await uploadOnCloudinary(coverImageLocalPath)
    
  if (!coverImage.url) {
    throw ApiError(400, "Error while uploading CoverImage")
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        coverImage: coverImage.url
      }
    },
    {new: true}
  ).select("-password")

  return resp
  .status(200)
  .json(new ApiResponse(200, user, "User coverImage updated successfully"))
})


// Get user channel profiles
const getUserChannelProfiles = asyncHandler(async (req, resp) => {
  const {username} = req.params

  if (!username?.trim()) {
    throw new ApiError(400, "Username is missing")
  }

  const channel = await User.aggregate([
    {
      $match: {
        username: username?.toLowerCase()
      }
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "channel",
        as: "subscribers"
      }
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "subscriber",
        as: "subscribers"
      }
    },
    {
      $addField: {
        subscribersCount: {
          $size: "$subscribers"
        },
        channelsSubscribedToCount: {
          $size: "$subscribedTo"
        },
        isSubscribed: {
          $cond: {
            if: { $in: [req.user?._id, "$subscribers.subscriber"] },
            then: true,
            else: false
          }
        }
      }
    },
    {
      $project: {
        fullName: 1,
        username: 1,
        subscribersCount: 1,
        channelsSubscribedToCount: 1,
        isSubscribed: 1,
        avatar: 1,
        coverIMage: 1,
        email: 1
      }
    }
  ])

  if (!channel?.length) {
    throw new ApiError(404, "Channel does not exist")
  } 

  return resp
    .status(200)
    .json(
      new ApiResponse(200, channel[0], "User channel fetched successfully")
    )
})


// get watch history 
const getWatchHistory = asyncHandler(async (req, resp) => {
  const user = await User.aggregate([
    {
      $match:{
        _id: new mongoose.Types.ObjectId(req.user?._id)
      }
    },
    {
      $lookup: {
        from: "videos",
        localField: "_id",
        foreignField: "_id",
        as: "watchHistory",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as: "owner",
              pipeline: [
                {
                  $project: {
                    fullName: 1,
                    username: 1,
                    avatar: 1
                  }
                }
              ]
            }
          }, 
          {
            $addFields: {
              owner: {
                $first: "$owner"
              }
            }
          }
        ]
      }
    }
  ])
  return resp
    .status(200)
    .json(
      new ApiResponse(200, user[0].watchHistory, "User watch history fetched successfully")
  )
})


export {
  registerUser, 
  loginUser, 
  logoutUser, 
  refreshAccessToken, 
  changePassword, 
  getCurrentUser,
  updateAccountDetails,
  updateUserAvatar,
  updateUserCoverImage,
  getUserChannelProfiles,
  getWatchHistory
};
