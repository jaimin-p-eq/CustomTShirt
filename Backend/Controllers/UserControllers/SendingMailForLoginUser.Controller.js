import ApiResponse from "../../Utils/ApiResponse.js";
import SendOTP from "../../Utils/SendOTP.js";
import User from "../../models/User.model.js";

const generateOTP = () => {
  return Math.floor(1000 + Math.random() * 9000);
};

const SendingMailForLoginUser = async (req, res) => {
  try {
    const { Email } = req.body;
    const user = await User.findOne({ Email });

    if (!user) {
      return ApiResponse(res, false, "Invalid Email", 400);
    }

    if (!user.isVerified) {
      return ApiResponse(res, false, "User is not verified", 400);
    }

    const OTP = generateOTP();
    const OTPExpiry = new Date(Date.now() + 10 * 60 * 1000);

    user.OTP = OTP;
    user.OTPExpiry = OTPExpiry;

    const htmlContent = `
  <p>Hello,</p>
  <p>You've requested to log in to WearMyArt. Your One-Time Password (OTP) code is: <strong>${OTP}</strong></p>
  <p>This OTP will expire in 10 minutes, so please use it before it expires.</p>
  <p>If you did not request this login, please ignore this email. Your account is secure.</p>
  <p>If you encounter any issues or did not request this login attempt, please contact our support team.</p>
  <p>Thank you for using WearMyArt!</p>
`;

    const name = "WearMyArt Login";
    const subject = "Login code of WearMyArt";
    const otpResponse = await SendOTP(Email, name, subject, htmlContent);

    await user.save();

    return ApiResponse(res, true, null, "OTP Sent Successfully", 200);
  } catch (error) {
    return ApiResponse(res, false, error.message, 500);
  }
};

export default SendingMailForLoginUser;
