import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/auth.model.js";


export const authMiddleware = asyncHandler(async (req, _, next) => {
    try {
        // const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
        const token = req.header("Authorization")?.replace("Bearer ", "") || req.cookies?.accessToken;
        if (!token) {
            throw new ApiError(400, "Authentication token is missing");
        }
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken");

        if (!user) {
            throw new ApiError(401, "Invalid Access Token");
        }
        req.user = user;
        next();
    } catch (error) {
         if (error.name === 'JsonWebTokenError') {
            throw new ApiError(401, "Invalid token format");
        } else if (error.name === 'TokenExpiredError') {
            throw new ApiError(401, "Token has expired");
        } else if (error.name === 'NotBeforeError') {
            throw new ApiError(401, "Token not active yet");
        }
    //    console.log("login error",error.message)
    //   throw new Error(500, "Authentication failed. Please try again.");
      throw new ApiError(401, error?.message || "Invalid access token")
    }
    
});