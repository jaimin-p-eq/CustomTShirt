import { Button, TextField, IconButton } from "@mui/material";
import React, { useState } from "react";
import ApiURLS from "../Data/ApiURLS";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { login } from "../Redux/UserSlice";
import { IoEyeOutline } from "react-icons/io5";
import { FaEyeSlash } from "react-icons/fa6";
import { showToast } from "../Redux/toastSlice";

const Login = () => {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const dispatch = useDispatch();
  const Navigate = useNavigate();

  const triggerToast = (message, variant) => {
    dispatch(showToast({ message, variant }));
  };

  const [showPassword, setShowPassword] = useState(false);
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const onChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateForm = () => {
    let formValid = true;
    const newErrors = { email: "", password: "" };

    if (!emailRegex.test(loginData.email)) {
      newErrors.email = "Invalid email format";
      formValid = false;
    }

    if (loginData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
      formValid = false;
    }

    setErrors(newErrors);
    return formValid;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return false;
    }
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}${ApiURLS.Login}`,
        loginData
      );
      if (res.data.success) {
        dispatch(login(res.data.data.user));
        triggerToast(res.data.message, "success");
        Navigate("/");
      } else if (!res.data.success) {
        triggerToast(res.data.data, "error");
      }
    } catch (error) {
      console.log("Error during registration:", error.message);
      triggerToast(error.message, "error");
    }
  };

  const NavigateToRegister = () => {
    Navigate("/register");
  };

  const handleClickShowPassword = () => {
    setShowPassword((prevState) => !prevState);
  };

  return (
    <form
      onSubmit={onSubmit}
      className="flex justify-center items-center h-screen bg-gray-100"
    >
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-semibold text-center mb-6 text-gray-700">
          Login
        </h2>

        <div className="flex flex-col gap-4">
          <TextField
            id="email"
            label="Enter Email"
            variant="outlined"
            name="email"
            type="email"
            value={loginData.email}
            onChange={onChange}
            fullWidth
            className="input-field"
            error={!!errors.email}
            helperText={errors.email}
          />
          <TextField
            id="password"
            label="Password"
            variant="outlined"
            name="password"
            type={showPassword ? "text" : "password"}
            value={loginData.password}
            onChange={onChange}
            fullWidth
            className="input-field"
            error={!!errors.password}
            helperText={errors.password}
            InputProps={{
              endAdornment: (
                <IconButton
                  position="end"
                  onClick={handleClickShowPassword}
                  edge="end"
                >
                  {showPassword ? <IoEyeOutline /> : <FaEyeSlash />}
                </IconButton>
              ),
            }}
          />
        </div>

        <div className="mt-4">
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            className="mt-6 py-2 text-white font-semibold bg-blue-500 hover:bg-blue-600 rounded-lg"
          >
            Login
          </Button>
        </div>

        <p className="text-center text-md mt-5">
          Don't have an account?{" "}
          <span
            onClick={NavigateToRegister}
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
