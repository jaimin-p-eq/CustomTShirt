import {
  Button,
  TextField,
  IconButton,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoEyeOutline } from "react-icons/io5";
import { FaEyeSlash } from "react-icons/fa6";
import { useDispatch } from "react-redux";
import { showToast } from "../Redux/toastSlice";
import ApiURLS from "../Data/ApiURLS";
import axios from "axios";
import { login } from "../Redux/UserSlice";

const Register = () => {
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    isAdmin: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
  });

  const Navigate = useNavigate();
  const dispatch = useDispatch();

  const onChange = (e) => {
    const { name, value } = e.target;
    setRegisterData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAdminChange = (event) => {
    setRegisterData((prevData) => ({
      ...prevData,
      isAdmin: event.target.checked,
    }));
  };

  const validateForm = () => {
    let formValid = true;
    const newErrors = { name: "", email: "", password: "" };

    if (registerData.name.length < 6) {
      newErrors.name = "Name must be at least 6 characters long";
      formValid = false;
    }
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(registerData.email)) {
      newErrors.email = "Invalid email format";
      formValid = false;
    }

    if (registerData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
      formValid = false;
    }

    setErrors(newErrors);
    return formValid;
  };

  const triggerToast = (message, variant) => {
    dispatch(showToast({ message, variant }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return false;
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}${ApiURLS.Register}`,
        registerData
      );
      if (res.data.success) {
        dispatch(login(res.data.data.user));
        triggerToast(res.data.message, "success");
        Navigate("/");
      } else if (!res.data.success) {
        triggerToast(res.data.data, "error");
      }
    } catch (error) {
      console.log("Error during registration:", error);
      triggerToast(error.message, "error");
    }
  };

  const NavigateToLogin = () => {
    Navigate("/login");
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
          Register
        </h2>

        <div className="flex flex-col gap-4">
          <TextField
            id="name"
            label="Enter Name"
            variant="outlined"
            name="name"
            type="text"
            value={registerData.name}
            onChange={onChange}
            fullWidth
            className="input-field"
            error={!!errors.name}
            helperText={errors.name}
          />
          <TextField
            id="email"
            label="Enter Email"
            variant="outlined"
            name="email"
            type="email"
            value={registerData.email}
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
            value={registerData.password}
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

          <FormControlLabel
            control={
              <Checkbox
                checked={registerData.isAdmin}
                onChange={handleAdminChange}
                inputProps={{ "aria-label": "Admin checkbox" }}
              />
            }
            label="Admin"
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
            Register
          </Button>
        </div>

        <p className="text-center text-md mt-5">
          Already have an account?{" "}
          <span
            onClick={NavigateToLogin}
            className="cursor-pointer text-blue-500"
          >
            Login Here
          </span>
        </p>
      </div>
    </form>
  );
};

export default Register;
