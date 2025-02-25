import ApiResponse from "../Utils/ApiResponse.js";
import User from "../models/User.model.js";
import jwt from "jsonwebtoken";

const TokenVerification = async function (req, res, next, checkAdmin = false) {
  const token = req.cookies?.RefreshToken || req.header("RefreshToken");

  if (!token) {
    return ApiResponse(res, false, null, "No token, authorization denied", 401);
  }

  try {
    const decodedUser = jwt.verify(
      token.replace("Bearer ", ""),
      process.env.JWT_SECRET
    );

    const user = await User.findById(decodedUser?._id);

    if (!user) {
      return ApiResponse(res, false, null, "Token is not valid", 401);
    }

    if (checkAdmin && !user.isAdmin) {
      return ApiResponse(res, false, null, "You are not authorized", 403);
    }

    req.user = user;
    next();
  } catch (error) {
    return ApiResponse(res, false, null, error.message, 500);
  }
};

export default TokenVerification;
