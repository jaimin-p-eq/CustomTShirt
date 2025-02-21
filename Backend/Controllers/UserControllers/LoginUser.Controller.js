import User from "../../models/User.model.js";
import ApiResponse from "../../Utils/ApiResponse.js";
import { GenerateAndSetTokens } from "../../Utils/GenerateAndSetTokens.js";

const LoginUser = async (req, res) => {
  try {
    const { Email, OTP } = req.body;
    const user = await User.findOne({ Email });

    if (!user) {
      return ApiResponse(res, false, "Invalid Email", 400);
    }

    if (!user.isVerified) {
      return ApiResponse(res, false, "User is not verified", 400);
    }

    if (OTP !== user.OTP) {
      return ApiResponse(res, false, "Invalid OTP", 400);
    }

    if (user.OTPExpiry < Date.now()) {
      return ApiResponse(res, false, "Invalid OTP", 400);
    }

    const { AccessToken, RefreshToken } = GenerateAndSetTokens(user._id, res);

    const userResponse = user.toObject();
    userResponse.AccessToken = AccessToken;
    userResponse.RefreshToken = RefreshToken;
    delete userResponse.isAdmin;
    delete userResponse.OTP;
    delete userResponse.OTPExpiry;

    return ApiResponse(res, true, userResponse, "User Successfully Login", 200);
  } catch (error) {
    return ApiResponse(res, false, error.message, 500);
  }
};

export default LoginUser;
