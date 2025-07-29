import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/auth.model.js";
import { sendEmail } from "../utils/sendEmail.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { UserProfile } from "../models/userProfile.model.js";
import { CompanyProfile } from "../models/companyProfile.model.js";
import { AdminProfile } from "../models/adminProfile.model.js";


const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Error generating tokens");
  }
};

// const registerUser = asyncHandler(async (req, res) => {
//   const {
//     firstName,
//     lastName,
//     email,
//     password,
//     role
//   } = req.body;

//   if (!firstName || !lastName || !email || !password || !role) {
//     throw new ApiError(400, "All required fields must be filled");
//   }
//   const existedUser = await User.findOne({ email });

//   if (existedUser) {
//     throw new ApiError(409, "User already exists with this email ");
//   }

//   const user = await User.create({
//     firstName,
//     lastName,
//     email,
//     password,
//     role,

//   });

//   const createdUser = await User.findById(user._id).select(
//     "-password -refreshToken"
//   );
//   const accessToken=user.generateAccessToken();

//   return res
//     .status(201)
//     .json(new ApiResponse(201, {
//       createdUser,
//       accessToken,
//       role: user.role
//     },
//        "User registered successfully"));
// });
const registerUser = asyncHandler(async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    password,
    role
  } = req.body;

  if (!firstName || !lastName || !email || !password || !role) {
    throw new ApiError(400, "All required fields must be filled");
  }
  
  const existedUser = await User.findOne({ email });

  if (existedUser) {
    throw new ApiError(409, "User already exists with this email ");
  }

  const user = await User.create({
    firstName,
    lastName,
    email,
    password,
    role,
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  
  // 🔍 Debug: Log user creation
  console.log("=== REGISTRATION DEBUG ===");
  console.log("Created user:", { 
    id: createdUser._id, 
    email: createdUser.email, 
    role: createdUser.role 
  });
  
  // 🔍 Debug: Check JWT secret
  console.log("JWT Secret exists:", !!process.env.ACCESS_TOKEN_SECRET);
  console.log("ACCESS_TOKEN_EXPIRY:", process.env.ACCESS_TOKEN_EXPIRY);
  
  const accessToken = user.generateAccessToken();
  
  // 🔍 Debug: Log generated token
  console.log("Generated token:", accessToken ? `${accessToken.substring(0, 20)}...` : "No token generated");
  
  // 🔍 Debug: Try to decode the generated token
  try {
    const decoded = jwt.decode(accessToken);
    console.log("Token payload:", decoded);
  } catch (decodeError) {
    console.log("❌ Error decoding generated token:", decodeError.message);
  }

  return res
    .status(201)
    .json(new ApiResponse(201, {
      createdUser,
      accessToken,
      role: user.role
    },
       "User registered successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  let profileCompleted = false;
  if (user.role === "jobseeker") {
    profileCompleted = await UserProfile.exists({ userId: user._id });
  } else if (user.role === "company") {
    profileCompleted = await CompanyProfile.exists({ userId: user._id });
  } else if (user.role === "admin") {
    profileCompleted = await AdminProfile.exists({ userId: user._id });
  }

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          role: user.role,
          profileCompleted: !!profileCompleted,
          accessToken,
          refreshToken,
        },
        "User logged in successfully"
      )
    );
});

const sendOtp = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) throw new ApiError(400, "Email is required");

  const user = await User.findOne({ email });
  if (!user) throw new ApiError(404, "User not found");

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiry = Date.now() + 5 * 60 * 1000;

  user.otp = otp;
  user.otpExpiry = new Date(expiry);
  await user.save({ validateBeforeSave: false });

  const message = `<p>Your OTP is <b>${otp}</b>. It is valid for 5 minutes.</p>`;
  await sendEmail(email, "OTP for Login", message);

  return res.status(200).json(new ApiResponse(200, null, "OTP sent successfully"));
});


const loginWithOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) throw new ApiError(400, "Email and OTP required");

  const user = await User.findOne({ email }).select("+otp +otpExpiry");
  if (!user) throw new ApiError(404, "User not found");
  // console.log("User OTP:", user.otp, "Provided OTP:", otp);
  // console.log("User OTP Expiry:", user.otpExpiry, "Current Time:", new Date());

  if (user.otp !== otp || user.otpExpiry < new Date()) {
    throw new ApiError(401, "Invalid or expired OTP");
  }

  user.otp = null;
  user.otpExpiry = null;
  await user.save({ validateBeforeSave: false });

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);
  const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

  let profileCompleted = false;
  if (user.role === "jobseeker") {
    profileCompleted = await UserProfile.exists({ userId: user._id });
  } else if (user.role === "company") {
    profileCompleted = await CompanyProfile.exists({ userId: user._id });
  } else if (user.role === "admin") {
    profileCompleted = await AdminProfile.exists({ userId: user._id });
  }

  const options = { httpOnly: true, secure: true };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          role: user.role,
          profileCompleted: !!profileCompleted,
          accessToken, refreshToken
        },
        "Logged in with OTP successfully"
      )
    );
});


const updateAuthProfile = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { email, firstName, lastName } = req.body;
  if (email) {
    const existing = await User.findOne({ email, _id: { $ne: userId } });
    if (existing) {
      throw new ApiError(409, "Email already in use by another user")
    }
  }
  const updatedFields = {};
  if (email) updatedFields.email = email;
  if (firstName) updatedFields.firstName = firstName;
  if (lastName) updatedFields.lastName = lastName;
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $set: updatedFields },
    { new: true, runValidators: true, select: "-password -refreshToken" }
  );
  if (!updatedUser) {
    throw new ApiError(404, "User not found");
  }

  res.status(200).json(
    new ApiResponse(200, updatedUser, "Profile updated successfully")
  );
});


const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password -refreshToken");
  res.status(200).json(new ApiResponse(200, user, "User profile fetched"));
});

const getAllUsers = asyncHandler(async (req, res) => {
  const jobseekers = await User.find({ role: "jobseeker" }).select("-password -refreshToken");
  const companies = await User.find({ role: "company" }).select("-password -refreshToken")
  const admin = await User.find({ role: "admin" }).select("-password -refreshToken")

  res.status(200).json(new ApiResponse(200, {
    jobseekers,
    companies,
    admin
  }, "Fetched all users by role"));
});



const changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    throw new ApiError(400, "Both old and new passwords are required");
  }


  const user = await User.findById(req.user._id).select("+password");

  if (!user) {
    throw new ApiError(404, "User not found");
  }


  const isMatch = await user.isPasswordCorrect(oldPassword);
  if (!isMatch) {
    throw new ApiError(401, "Old password is incorrect");
  }


  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  res.status(200).json(
    new ApiResponse(200, null, "Password changed successfully")
  );
});


const logoutUser=asyncHandler(async (req,res)=>{
await User.findByIdAndUpdate(
req.user._id,{
  $unset:{
    refreshToken:1,
  },

},
{
  new:true,
}
);
  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"));
});

export { registerUser, loginUser, sendOtp, loginWithOtp, generateAccessAndRefreshTokens, getCurrentUser, getAllUsers, changePassword, updateAuthProfile,logoutUser };
