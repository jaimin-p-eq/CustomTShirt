import { model, Schema } from "mongoose";

const UserSchema = new Schema(
  {
    FullName: {
      type: String,
      required: true,
    },
    Email: {
      type: String,
      required: true,
      unique: true,
    },
    Password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    isBlocked: {
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
  },
  { timestamps: true }
);

const User = model("User", UserSchema);

export default User;
