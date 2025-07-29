import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { UserProfile } from "../models/userProfile.model.js";
import { CompanyProfile } from "../models/companyProfile.model.js";
import { AdminProfile } from "../models/adminProfile.model.js"; 

export const checkProfile = asyncHandler(async (req, res, next) => {
  const user = req.user; 

  if (!user) {
    throw new ApiError(401, "User not authenticated");
  }

  let profileExists = false;

  if (user.role === "jobseeker") {
    profileExists = await UserProfile.findOne({ userId: user._id });
  } else if (user.role === "company") {
    profileExists = await CompanyProfile.findOne({ userId: user._id });
  } else if (user.role === "admin") {
    profileExists = await AdminProfile.findOne({ userId: user._id });
  }

  if (!profileExists) {
    throw new ApiError(403, `Please create a ${user.role} profile before proceeding`);
  }

  next();
});

