import { Button, TextField } from "@mui/material";
import React, { useState } from "react";
import ApiURLS from "../Data/ApiURLS";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { login } from "../Redux/UserSlice";
import { showToast } from "../Redux/toastSlice";

const Login = () => {
  const [loginData, setLoginData] = useState({
    Email: "",
    OTP: ["", "", "", ""],
  });

  const [errors, setErrors] = useState({
    Email: "",
    OTP: "",
  });

  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  const Navigate = useNavigate();

  const triggerToast = (message, variant) => {
    dispatch(showToast({ message, variant }));
  };

  const EmailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const onChange = (e, index) => {
    const { value } = e.target;
    if (value.length <= 1) {
      setLoginData((prevData) => {
        const otpCopy = [...prevData.OTP];
        otpCopy[index] = value;
        return { ...prevData, OTP: otpCopy };
      });
      if (value && index < 3) {
        document.getElementById(`otp-${index + 1}`).focus();
      }
    }
  };

  const validateForm = () => {
    let formValid = true;
    const newErrors = { Email: "", OTP: "" };

    if (!EmailRegex.test(loginData.Email)) {
      newErrors.Email = "Invalid Email format";
      formValid = false;
    }

    if (isOtpSent && loginData.OTP.join("").length !== 4) {
      newErrors.OTP = "OTP must be 4 digits";
      formValid = false;
    }

    setErrors(newErrors);
    return formValid;
  };

  const onSubmitEmail = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return false;
    }
    setIsLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}${ApiURLS.SendingMailForLoginUser}`,
        { Email: loginData.Email }
      );
      if (res.data.success) {
        setIsOtpSent(true);
        triggerToast(res.data.message, "success");
      } else {
        triggerToast(res.data.data, "error");
      }
    } catch (error) {
      triggerToast(error.response.data.message, "error");
    }
    setIsLoading(false);
  };

  const onSubmitOtp = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return false;
    }
    setIsLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}${ApiURLS.Login}`,
        { Email: loginData.Email, OTP: loginData.OTP.join("") }
      );

      if (res.data.success) {
        dispatch(login(res.data.data.user));
        triggerToast(res.data.message, "success");
        // Navigate("/");
      } else {
        triggerToast(res.data.data, "error");
      }
    } catch (error) {
      triggerToast(error.response.data.message, "error");
    }
    setIsLoading(false);
  };

  return (
    <form
      onSubmit={isOtpSent ? onSubmitOtp : onSubmitEmail}
      className="flex justify-center items-center h-screen bg-gray-100"
    >
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-semibold text-center mb-6 text-gray-700">
          Login
        </h2>

        <div className="flex flex-col gap-4">
          <TextField
            id="Email"
            label="Enter Email"
            variant="outlined"
            name="Email"
            type="email"
            value={loginData.Email}
            onChange={(e) =>
              setLoginData({ ...loginData, Email: e.target.value })
            }
            fullWidth
            className="input-field"
            error={!!errors.Email}
            helperText={errors.Email}
            disabled={isOtpSent}
          />

          {isOtpSent && (
            <div className="flex gap-2 items-center justify-center">
              {loginData.OTP.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="number"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => onChange(e, index)}
                  className="w-12 h-12 text-center border rounded-lg focus:outline-none"
                />
              ))}
            </div>
          )}
        </div>

        <div className="mt-4">
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            className="btn btn-primary"
            disabled={isLoading}
          >
            {isOtpSent ? "Verify OTP" : "Send OTP"}
          </Button>
        </div>

        <p className="text-center text-md mt-5">
          Don't have an account?{" "}
          <span
            onClick={() => Navigate("/register")}
            className="cursor-pointer text-blue-500"
          >
            Register Here
          </span>
        </p>
      </div>
    </form>
  );
};

export default Login;
