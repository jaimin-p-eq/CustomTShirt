import ApiResponse from "../../Utils/ApiResponse.js";
import SendOTP from "../../Utils/SendOTP.js";
import User from "../../models/User.model.js";

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

    const OTP = Math.floor(1000 + Math.random() * 9000);
    const OTPExpiry = new Date(Date.now() + 10 * 60 * 1000);

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
    const otpResponse = await SendOTP(Email, name, subject, htmlContent);

    if (!otpResponse.success) {
      return ApiResponse(res, false, otpResponse.message, 500);
    }

    await newUser.save();

    const userResponse = newUser.toObject();
    delete userResponse.isAdmin;
    delete userResponse.OTP;
    delete userResponse.OTPExpiry;

    return ApiResponse(
      res,
      true,
      { user: userResponse },
      "User created successfully and OTP sent",
      200
    );
  } catch (error) {
    return ApiResponse(res, false, error.message, 500);
  }
};

export default RegisterUser;
