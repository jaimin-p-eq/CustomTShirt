import { model, Schema } from "mongoose";

const otpSchema = new Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 600 }, // expires in 600 seconds (10 minutes)
});

const OTPModel = model("OTP", otpSchema);
export default OTPModel;
