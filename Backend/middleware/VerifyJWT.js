import jwt, { decode } from "jsonwebtoken";
import ApiResponse from "../Utils/ApiResponse.js";
import User from "../models/User.model.js";

const VerifyJWT = async (req, res, next) => {
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

    req.user = user;
    next();
  } catch (error) {
    return ApiResponse(res, false, null, error.message, 401);
  }
};

export default VerifyJWT;
