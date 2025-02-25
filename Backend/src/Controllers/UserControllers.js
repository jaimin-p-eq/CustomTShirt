import User from "../models/User.model.js";
import Order from "../models/Order.model.js";
import ApiResponse from "../Utils/ApiResponse.js";
import mongoose from "mongoose";
import { GenerateAndSetTokens } from "../Utils/GenerateAndSetTokens.js";
import { SendMail } from "../Utils/SendMail.js";
import jwt from "jsonwebtoken";

const generateOTP = () => {
  const OTP = Math.floor(1000 + Math.random() * 9000);
  const OTPExpiry = new Date(Date.now() + 10 * 60 * 1000);

  return { OTP, OTPExpiry };
};

// Register and Verify First
const RegisterUser = async (req, res) => {
  try {
    const { FullName, Email, isAdmin } = req.body;
    const existedUser = await User.findOne({ Email });

    if (existedUser && existedUser.isVerified) {
      return ApiResponse(
        res,
        false,
        "User already exists with this email",
        401
      );
    }

    const { OTP, OTPExpiry } = generateOTP();

    const newUser = new User({
      FullName,
      Email,
      OTP,
      isAdmin,
      OTPExpiry,
    });

    const htmlContent = `
      <p>Hello, ${FullName}</p>
      <p>Thank you for registering with WearMyArt!</p>
      <p>Your OTP code is <strong>${OTP}</strong>. It will expire in 10 minutes.</p>
      <p>Please enter this OTP code in the registration form to complete your registration.</p>
      <p>If you encounter any issues, feel free to contact our support team.</p>
      <p>Thank you for choosing WearMyArt!</p>
    `;

    const name = "WearMyArt Registration";
    const subject = "Registration code of WearMyArt";
    const otpResponse = await SendMail(Email, name, subject, htmlContent);

    if (!otpResponse.success) {
      return ApiResponse(res, false, null, otpResponse.message, 500);
    }

    await newUser.save();

    const userResponse = newUser.toObject();
    delete userResponse.isAdmin;
    delete userResponse.OTP;
    delete userResponse.OTPExpiry;
    delete userResponse.isVerified;

    return ApiResponse(
      res,
      true,
      { user: userResponse },
      "User created successfully and OTP sent",
      200
    );
  } catch (error) {
    return ApiResponse(res, false, null, error.message, 500);
  }
};
const VerifyUser = async (req, res) => {
  try {
    const { Email, OTP } = req.body;

    const existedUser = await User.findOne({ Email });

    if (!existedUser) {
      return ApiResponse(
        res,
        false,
        "User does not exist with this email",
        401
      );
    }

    if (OTP !== existedUser.OTP || existedUser.OTPExpiry < Date.now()) {
      return ApiResponse(
        res,
        false,
        "Invalid OTP or OTP has expired, please try again",
        401
      );
    }

    existedUser.isVerified = true;

    const htmlContent = `
    <p>Hello, ${existedUser.FullName}</p>
    <p>Congratulations! Your account has been successfully verified.</p>
    <p>You can now access all the features available to verified users. Thank you for being a part of our community!</p>
`;

    const name = "WearMyArt Email varification Successfull";
    const subject = "Email varification successfull completed on WearMyArt";
    const otpResponse = await SendMail(Email, name, subject, htmlContent);

    const { AccessToken, RefreshToken } = GenerateAndSetTokens(
      existedUser._id,
      res
    );

    await existedUser.save();
    const userResponse = existedUser.toObject();
    delete userResponse.isAdmin;
    delete userResponse.OTP;
    delete userResponse.OTPExpiry;
    delete userResponse.isVerified;

    return ApiResponse(
      res,
      true,
      { user: userResponse, tokens: { AccessToken, RefreshAccessToken } },
      "User verified successfully",
      200
    );
  } catch (error) {
    return ApiResponse(res, false, null, error.message, 500);
  }
};

const SendingMailForLoginUser = async (req, res) => {
  try {
    const { Email } = req.body;
    const user = await User.findOne({ Email });

    if (!user) {
      return ApiResponse(res, false, null, "Invalid Email", 400);
    }

    if (!user.isVerified) {
      return ApiResponse(res, false, null, "User is not verified", 400);
    }

    const { OTP, OTPExpiry } = generateOTP();

    user.OTP = OTP;
    user.OTPExpiry = OTPExpiry;

    const htmlContent = `
      <p>Hello, ${user.FullName}</p>
      <p>You've requested to log in to WearMyArt. Your One-Time Password (OTP) code is: <strong>${OTP}</strong></p>
      <p>This OTP will expire in 10 minutes, so please use it before it expires.</p>
      <p>If you did not request this login, please ignore this email. Your account is secure.</p>
      <p>If you encounter any issues or did not request this login attempt, please contact our support team.</p>
      <p>Thank you for using WearMyArt!</p>
    `;

    const name = "WearMyArt Login";
    const subject = "Login code of WearMyArt";
    const otpResponse = await SendMail(Email, name, subject, htmlContent);

    await user.save();

    return ApiResponse(res, true, null, "OTP Sent Successfully", 200);
  } catch (error) {
    console.log(error);
    return ApiResponse(res, false, null, error.message, 500);
  }
};
const LoginUser = async (req, res) => {
  try {
    const { Email, OTP } = req.body;
    const user = await User.findOne({ Email });

    if (!user) {
      return ApiResponse(res, false, null, "Invalid Email", 400);
    }

    if (!user.isVerified) {
      return ApiResponse(res, false, null, "User is not verified", 400);
    }

    if (OTP != user.OTP) {
      return ApiResponse(res, false, null, "Invalid OTP", 400);
    }

    if (user.OTPExpiry < Date.now()) {
      return ApiResponse(res, false, null, "OTP Expired", 400);
    }

    const { AccessToken, RefreshToken } = GenerateAndSetTokens(user._id, res);

    const userResponse = user.toObject();
    delete userResponse.isAdmin;
    delete userResponse.OTP;
    delete userResponse.OTPExpiry;
    delete userResponse.isVerified;

    return ApiResponse(
      res,
      true,
      { user: userResponse, tokens: { AccessToken, RefreshAccessToken } },
      "User Successfully Login",
      200
    );
  } catch (error) {
    return ApiResponse(res, false, null, error.message, 500);
  }
};

const GetAllOwnOrder = async (req, res) => {
  try {
    const customerId = req.user._id;

    const { Email, FullName } = req.user;

    if (!mongoose.Types.ObjectId.isValid(customerId)) {
      return ApiResponse(res, false, null, "Invalid user ID", 400);
    }

    const customerObjectId = new mongoose.Types.ObjectId(customerId);

    const pipeline = [
      {
        $match: {
          CustomerId: customerObjectId,
        },
      },
      {
        $sort: {
          orderDate: -1,
        },
      },
      {
        $project: {
          orderId: 1,
          CustomerImg: 1,
          FinalProductImg: 1,
          Font: 1,
          Text: 1,
          Color: 1,
          Quantity: 1,
          FinalCost: 1,
          Status: 1,
        },
      },
    ];

    const result = await Order.aggregate(pipeline);

    if (result.length > 0) {
      ApiResponse(res, true, result, "Orders fetched successfully");
    } else {
      ApiResponse(res, false, null, "No orders found for this customer", 404);
    }
  } catch (error) {
    ApiResponse(res, false, null, `Error: ${error.message}`, 500);
  }
};
const GetSingleUser = async (req, res) => {
  try {
    const { id } = req.params;

    const SingleUser = await User.findById(id);

    return ApiResponse(res, true, SingleUser, "User Fetched Successfully", 200);
  } catch (error) {
    return ApiResponse(res, false, null, error.message, 500);
  }
};

const RefreshAccessToken = async (req, res) => {
  const token = req.cookies?.AccessToken || req.header("AccessToken");

  if (!token) {
    return ApiResponse(
      res,
      false,
      null,
      "No access token, authorization denied",
      401
    );
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

    const { AccessToken } = GenerateAndSetTokens(user._id, res);

    user.AccessToken = AccessToken;
    await user.save();

    const userResponse = user.toObject();
    delete userResponse.isAdmin;
    delete userResponse.OTP;
    delete userResponse.OTPExpiry;

    return ApiResponse(res, true, userResponse, "Tokens are refreshed", 200);
  } catch (error) {
    return ApiResponse(res, false, null, error.message, 401);
  }
};

const UpdateUser = async (req, res) => {
  try {
    const { _id } = req.user;

    const { name, email } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      _id,
      { name, email },
      { new: true }
    );

    if (!updatedUser) {
      return ApiResponse(res, false, null, "User not found", 404);
    }

    return ApiResponse(
      res,
      true,
      updatedUser,
      "User Updated Successfully",
      200
    );
  } catch (error) {
    return ApiResponse(res, false, null, error.message, 500);
  }
};

const LogoutUser = async (req, res) => {
  try {
    const options = {
      httpOnly: true,
      secure: true,
    };

    res
      .clearCookie("AccessToken", options)
      .clearCookie("RefreshToken", options);

    return ApiResponse(res, true, null, "User is succesfully Logout", 200);
  } catch (error) {
    return ApiResponse(res, false, null, error.message, 500);
  }
};

const DeleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const DeleteUser = await User.findByIdAndDelete(id);

    if (!DeleteUser) {
      return ApiResponse(res, false, null, "User not found", 400);
    }

    return ApiResponse(res, true, "User is succesfully Deleted", 200);
  } catch (error) {
    return ApiResponse(res, false, null, error.message, 500);
  }
};

export {
  DeleteUser,
  GetAllOwnOrder,
  GetSingleUser,
  LoginUser,
  LogoutUser,
  RefreshAccessToken,
  RegisterUser,
  SendingMailForLoginUser,
  UpdateUser,
  VerifyUser,
};
