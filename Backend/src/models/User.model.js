import { model, Schema } from "mongoose";

const UserSchema = new Schema({
  FullName: {
    type: String,
    required: true,
  },
  Email: {
    type: String,
    required: true,
    unique: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  OTP: {
    type: Number,
    required: true,
  },
  OTPExpiry: {
    type: Date,
  },
});

const User = model("User", UserSchema);

export default User;
