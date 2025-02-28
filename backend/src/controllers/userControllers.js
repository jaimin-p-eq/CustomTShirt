import User from "../models/userModel.js";
import Order from "../models/orderModel.js";
import apiResponse from "../Utils/apiResponse.js";
import mongoose from "mongoose";
import { generateAndSetTokens } from "../Utils/generateAndSetTokens.js";
import { sendMail } from "../Utils/sendMail.js";
import bcrypt from "bcrypt";

const generateOTP = () => {
  const OTP = Math.floor(1000 + Math.random() * 9000);
  const OTPExpiry = new Date(Date.now() + 10 * 60 * 1000);

  return { OTP, OTPExpiry };
};
const validatePassword = (password) => {
  const minLength = 8;
  const maxLength = 16;
  const uppercaseRegex = /[A-Z]/;
  const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
  const numericRegex = /[0-9]/;

  if (password.length < minLength || password.length > maxLength) {
    return {
      success: false,
      message: `Password must be between ${minLength} and ${maxLength} characters.`,
    };
  }

  if (!uppercaseRegex.test(password)) {
    return {
      success: false,
      message: "Password must contain at least one uppercase letter.",
    };
  }

  if (!specialCharRegex.test(password)) {
    return {
      success: false,
      message: "Password must contain at least one special character.",
    };
  }

  if (!numericRegex.test(password)) {
    return {
      success: false,
      message: "Password must contain at least one numerical character.",
    };
  }

  return { success: true };
};

// Register and verify
const registerUser = async (req, res) => {
  try {
    const { FullName, Email, Password } = req.body;

    const passwordValidation = validatePassword(Password);
    if (!passwordValidation.success) {
      return apiResponse(res, false, null, passwordValidation.message, 400);
    }

    const existedUser = await User.findOne({ Email });

    if (existedUser) {
      return apiResponse(
        res,
        false,
        null,
        existedUser.isActive
          ? "User already exists"
          : "User exists but inactive",
        existedUser.isActive ? 401 : 402
      );
    }

    const { OTP, OTPExpiry } = generateOTP();
    const hashedPassword = await bcrypt.hash(Password, 10);

    const newUser = new User({
      FullName,
      Email,
      Password: hashedPassword,
      OTP,
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
    const otpResponse = await sendMail(Email, name, subject, htmlContent);

    if (!otpResponse.success) {
      return apiResponse(res, false, null, otpResponse.message, 500);
    }

    await newUser.save();
    return apiResponse(
      res,
      true,
      null,
      "User created successfully and OTP sent",
      200
    );
  } catch (error) {
    return apiResponse(res, false, null, error.message, 500);
  }
};
const activateUser = async (req, res) => {
  try {
    const { Email, OTP } = req.body;
    const existedUser = await User.findOne({ Email });

    if (!existedUser) {
      return apiResponse(
        res,
        false,
        null,
        "User does not exist with this email",
        401
      );
    }

    if (OTP != existedUser.OTP || existedUser.OTPExpiry < Date.now()) {
      return apiResponse(
        res,
        false,
        null,
        "Invalid OTP or OTP has expired, please try again",
        401
      );
    }

    existedUser.isActive = true;
    await existedUser.save();

    const htmlContent = `
      <p>Hello, ${existedUser.FullName}</p>
      <p>Congratulations! Your account has been successfully activated.</p>
      <p>You can now access all the features available to activated users. Thank you for being a part of our community!</p>
    `;

    const name = "WearMyArt Email Verification Successful";
    const subject = "Email verification successfully completed on WearMyArt";
    const otpResponse = await sendMail(Email, name, subject, htmlContent);

    const { AccessToken } = generateAndSetTokens(existedUser._id, res);

    return apiResponse(
      res,
      true,
      { user: { FullName: existedUser.FullName, Email }, AccessToken },
      "User activated successfully",
      200
    );
  } catch (error) {
    return apiResponse(res, false, null, error.message, 500);
  }
};

// Login user
const sendingMailForLoginUser = async (req, res) => {
  try {
    const { Email } = req.body;
    const user = await User.findOne({ Email });

    if (!user) {
      return apiResponse(res, false, null, "Invalid Email", 400);
    }

    if (user.isBlocked) {
      return apiResponse(res, false, null, "User is Blocked", 400);
    }

    if (!user.isActive) {
      return apiResponse(res, false, null, "User is not Active", 400);
    }

    const { OTP, OTPExpiry } = generateOTP();

    user.OTP = OTP;
    user.OTPExpiry = OTPExpiry;

    const htmlContent = `
      <p>Hello, ${user.FullName}</p>
      <p>You've requested to log in to WearMyArt. Your One-Time Password (OTP) code is: <strong>${OTP}</strong></p>
      <p>This OTP will expire in 10 minutes, so please use it before it expires.</p>
      <p>If you encounter any issues or did not request this login attempt, please contact our support team.</p>
      <p>Thank you for using WearMyArt!</p>
    `;

    const name = "WearMyArt Login";
    const subject = "Login code of WearMyArt";
    const otpResponse = await sendMail(Email, name, subject, htmlContent);

    await user.save();

    return apiResponse(res, true, null, "OTP Sent Successfully", 200);
  } catch (error) {
    console.log(error);
    return apiResponse(res, false, null, error.message, 500);
  }
};
const loginUser = async (req, res) => {
  try {
    const { Email, OTP, Password } = req.body;
    const user = await User.findOne({ Email });

    if (!user) {
      return apiResponse(res, false, null, "Invalid Email", 400);
    }

    if (!OTP && !Password) {
      return apiResponse(res, false, null, "OTP or Password required", 400);
    }

    if (user.isBlocked) {
      return apiResponse(res, false, null, "User is Blocked", 400);
    }

    if (!user.isActive) {
      return apiResponse(res, false, null, "User is not verified", 400);
    }

    if (Password) {
      const isMatch = await bcrypt.compare(Password, user.Password);
      if (!isMatch) {
        return apiResponse(res, false, null, "Invalid Password", 400);
      }
    } else {
      if (OTP != user.OTP) {
        return apiResponse(res, false, null, "Invalid OTP", 400);
      }
      if (user.OTPExpiry < Date.now()) {
        return apiResponse(res, false, null, "OTP Expired", 400);
      }
    }

    const { AccessToken } = generateAndSetTokens(user._id, res);

    const userResponse = {
      FullName: user.FullName,
      Email,
    };

    return apiResponse(
      res,
      true,
      { user: userResponse, AccessToken },
      "User Successfully Login",
      200
    );
  } catch (error) {
    return apiResponse(res, false, null, error.message, 500);
  }
};

const makeAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return apiResponse(res, false, null, "User not found", 400);
    }
    if (user.isBlocked) {
      return apiResponse(res, false, null, "User is Blocked", 400);
    }
    if (user.isAdmin) {
      return apiResponse(res, false, null, "User is already an admin", 400);
    }

    user.isAdmin = true;
    await user.save({ validateBeforeSave: false });

    const htmlContent = `
      <p>Dear ${user.FullName},</p>
      <p>Congratulations! Your request has been approved, and you are now an Admin of WearMyArt.</p>
      <p>You now have administrative privileges to manage the platform effectively.</p>
      <p>If you have any questions or need assistance, please feel free to contact our support team.</p>
      <p>Thank you for being a valuable part of WearMyArt!</p>
      <br/>
      <p>Best Regards,</p>
      <p>WearMyArt Team</p>
    `;

    const name = "WearMyArt Admin";
    const subject = "You are now an Admin of WearMyArt";
    const otpResponse = await sendMail(user.Email, name, subject, htmlContent);

    return apiResponse(
      res,
      true,
      null,
      `Now, ${user.FullName} is an Admin`,
      200
    );
  } catch (error) {
    return apiResponse(res, false, null, error.message, 500);
  }
};

// Forgot password
const sendingMailForForgotPassword = async (req, res) => {
  try {
    const { Email } = req.body;
    const user = await User.findOne({ Email });

    if (!user) {
      return apiResponse(res, false, null, "Invalid Email", 400);
    }

    if (user.isBlocked) {
      return apiResponse(res, false, null, "User is Blocked", 400);
    }

    const { OTP, OTPExpiry } = generateOTP();

    user.OTP = OTP;
    user.OTPExpiry = OTPExpiry;

    const htmlContent = `
      <p>Hello, ${user.FullName}</p>
      <p>You've requested to Forgot Password in to WearMyArt. Your One-Time Password (OTP) code is: <strong>${OTP}</strong></p>
      <p>This OTP will expire in 10 minutes, so please use it before it expires.</p>
      <p>If you encounter any issues or did not request this login attempt, please contact our support team.</p>
      <p>Thank you for using WearMyArt!</p>
    `;

    const name = "WearMyArt Forgot Password";
    const subject = "Forgot Password code of WearMyArt";
    const otpResponse = await sendMail(Email, name, subject, htmlContent);

    await user.save();

    return apiResponse(res, true, null, "OTP Sent Successfully", 200);
  } catch (error) {
    console.log(error);
    return apiResponse(res, false, null, error.message, 500);
  }
};
const forgotPassword = async (req, res) => {
  try {
    const { Email, OTP, Password } = req.body;
    const user = await User.findOne({ Email });

    if (!user) {
      return apiResponse(res, false, null, "Invalid Email", 400);
    }
    if (user.isBlocked) {
      return apiResponse(res, false, null, "User is Blocked", 400);
    }
    if (OTP !== user.OTP) {
      return apiResponse(res, false, null, "Invalid OTP", 400);
    }
    if (user.OTPExpiry < Date.now()) {
      return apiResponse(res, false, null, "OTP Expired", 400);
    }

    const passwordValidation = validatePassword(Password);
    if (!passwordValidation.success) {
      return apiResponse(res, false, null, passwordValidation.message, 400);
    }

    const hashedPassword = await bcrypt.hash(Password, 10);
    user.Password = hashedPassword;

    await user.save({ validateBeforeSave: true });

    const userResponse = {
      FullName: user.FullName,
      Email: user.Email,
    };

    const htmlContent = `
  <p>Hello, ${user.FullName}</p>
  <p>Your password has been changed successfully for WearMyArt.</p>
  <p>If you did not request this change, please contact our support team immediately.</p>
  <p>For security reasons, we recommend using a strong and unique password.</p>
  <p>Thank you for choosing WearMyArt!</p>
`;

    const name = "WearMyArt Security";
    const subject = "Your Password Has Been Changed Successfully";
    const otpResponse = await sendMail(Email, name, subject, htmlContent);

    return apiResponse(
      res,
      true,
      { user: userResponse },
      "Password Changed Successfully",
      200
    );
  } catch (error) {
    return apiResponse(res, false, null, error.message, 500);
  }
};

const getAllOwnOrder = async (req, res) => {
  try {
    const customerId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(customerId)) {
      return apiResponse(res, false, null, "Invalid user ID", 400);
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
      apiResponse(res, true, result, "Orders fetched successfully", 200);
    } else {
      apiResponse(res, false, null, "No orders found", 404);
    }
  } catch (error) {
    apiResponse(res, false, null, `Error: ${error.message}`, 500);
  }
};
const getSingleUser = async (req, res) => {
  try {
    const { id } = req.params;

    const SingleUser = await User.findById(id);

    return apiResponse(res, true, SingleUser, "User Fetched Successfully", 200);
  } catch (error) {
    return apiResponse(res, false, null, error.message, 500);
  }
};

const updateUser = async (req, res) => {
  try {
    const { _id } = req.user;
    const { FullName, Email } = req.body;

    const updateData = {};
    if (FullName) updateData.FullName = FullName;
    if (Email) {
      const existingUser = await User.findOne({ Email, _id: { $ne: _id } });
      if (existingUser) {
        return apiResponse(res, false, null, "Email is already in use", 400);
      }
      updateData.Email = Email;
    }

    if (Object.keys(updateData).length === 0) {
      return apiResponse(res, false, null, "No valid fields to update", 400);
    }

    const updatedUser = await User.findByIdAndUpdate(_id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return apiResponse(res, false, null, "User not found", 404);
    }

    const userResponse = {
      FullName: updatedUser.FullName,
      Email: updatedUser.Email,
    };

    const htmlContent = `
      <p>Hello, ${updatedUser.FullName}</p>
      <p>Your profile details have been updated successfully on WearMyArt.</p>
      <p>If you did not make these changes, please contact our support team immediately.</p>
      <p>Thank you for being a part of WearMyArt!</p>
    `;

    const name = "WearMyArt Support";
    const subject = "Your Profile Has Been Updated";
    const emailResponse = await sendMail(
      updatedUser.Email,
      name,
      subject,
      htmlContent
    );

    if (!emailResponse.success) {
      return apiResponse(
        res,
        true,
        { user: userResponse },
        "User updated, but email notification failed",
        200
      );
    }

    return apiResponse(
      res,
      true,
      { user: userResponse },
      "User Updated Successfully",
      200
    );
  } catch (error) {
    return apiResponse(res, false, null, error.message, 500);
  }
};

const logoutUser = async (req, res) => {
  try {
    const options = {
      httpOnly: true,
      secure: true,
    };

    res.clearCookie("RefreshToken", options);

    return apiResponse(res, true, null, "User is succesfully Logout", 200);
  } catch (error) {
    return apiResponse(res, false, null, error.message, 500);
  }
};

const deleteUser = async (req, res) => {
  try {
    const { _id } = req.user;
    const DeleteUser = await User.findById(_id);

    if (!DeleteUser) {
      return apiResponse(res, false, null, "User not found", 400);
    }

    DeleteUser.isActive = false;

    await DeleteUser.save();

    return apiResponse(res, true, null, "User is succesfully Deleted", 200);
  } catch (error) {
    return apiResponse(res, false, null, error.message, 500);
  }
};

// Blocking and unblocking users by admin only
const blockUsers = async (req, res) => {
  try {
    const { userIds } = req.body;

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return apiResponse(res, false, null, "User IDs array is required", 400);
    }

    const users = await User.find({ _id: { $in: userIds } });

    if (users.length === 0) {
      return apiResponse(
        res,
        false,
        null,
        "No users found with given IDs",
        404
      );
    }

    await User.updateMany(
      { _id: { $in: userIds } },
      { $set: { isBlocked: true } }
    );

    const senderName = "WearMyArt Support";
    const subject = "Account Blocked Notification";

    for (const user of users) {
      const htmlContent = `
        <p>Hello, ${user.FullName}</p>
        <p>Your account has been temporarily blocked due to policy violations or security concerns.</p>
        <p>If you believe this was a mistake, please contact our support team.</p>
        <p>Thank you,</p>
        <p>WearMyArt Team</p>
      `;

      await sendMail(user.Email, senderName, subject, htmlContent);
    }

    return apiResponse(
      res,
      true,
      null,
      "Users blocked successfully and notified via email",
      200
    );
  } catch (error) {
    return apiResponse(res, false, null, error.message, 500);
  }
};

const unblockUsers = async (req, res) => {
  try {
    const { userIds } = req.body;

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return apiResponse(res, false, null, "User IDs array is required", 400);
    }

    const users = await User.find({ _id: { $in: userIds } });

    if (users.length === 0) {
      return apiResponse(
        res,
        false,
        null,
        "No users found with given IDs",
        404
      );
    }

    await User.updateMany(
      { _id: { $in: userIds } },
      { $set: { isBlocked: false } }
    );

    const senderName = "WearMyArt Support";
    const subject = "Account Unblocked Notification";

    for (const user of users) {
      const htmlContent = `
        <p>Hello, ${user.FullName}</p>
        <p>We are pleased to inform you that your account has been unblocked and restored.</p>
        <p>You can now log in and continue using our services.</p>
        <p>Thank you,</p>
        <p>WearMyArt Team</p>
      `;

      await sendMail(user.Email, senderName, subject, htmlContent);
    }

    return apiResponse(
      res,
      true,
      null,
      "Users unblocked successfully and notified via email",
      200
    );
  } catch (error) {
    return apiResponse(res, false, null, error.message, 500);
  }
};

export {
  registerUser,
  activateUser,
  sendingMailForLoginUser,
  loginUser,
  sendingMailForForgotPassword,
  forgotPassword,
  getAllOwnOrder,
  getSingleUser,
  updateUser,
  logoutUser,
  deleteUser,
  makeAdmin,
  blockUsers,
  unblockUsers,
};
