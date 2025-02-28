import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { showToast } from "../Redux/toastSlice";
import { login } from "../Redux/UserSlice";
import ApiURLS from "../Data/ApiURLS";
import axios from "axios";
import {
  Button,
  TextField,
  IconButton,
  Container,
  Paper,
  Typography,
  Box,
  InputAdornment,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import { IoEyeOutline } from "react-icons/io5";
import { FaEyeSlash } from "react-icons/fa6";
import { apiRequest } from "../utils/apiRequest.js";

const steps = ["Register", "OTP Verification"];

const Register = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [registerData, setRegisterData] = useState({
    FullName: "",
    Email: "",
    Password: "",
    OTP: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({
    FullName: "",
    Email: "",
    Password: "",
    OTP: "",
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onChange = (e) => {
    const { name, value } = e.target;
    setRegisterData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateForm = () => {
    let formValid = true;
    const newErrors = { FullName: "", Email: "", Password: "", OTP: "" };

    if (activeStep === 0) {
      if (registerData.FullName.length < 6) {
        newErrors.FullName = "FullName must be at least 6 characters long";
        formValid = false;
      }
      const EmailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!EmailRegex.test(registerData.Email)) {
        newErrors.Email = "Invalid Email format";
        formValid = false;
      }
      if (registerData.Password.length < 6) {
        newErrors.Password = "Password must be at least 6 characters long";
        formValid = false;
      }
    } else {
      if (!registerData.OTP) {
        newErrors.OTP = "Enter the OTP sent to your Email";
        formValid = false;
      }
    }
    setErrors(newErrors);
    return formValid;
  };

  const triggerToast = (message, variant) => {
    dispatch(showToast({ message, variant }));
  };

  const handleNext = async () => {
    if (!validateForm()) return;
    if (activeStep === 0) {
      const response = await apiRequest(
        ApiURLS.Register.url,
        ApiURLS.Register.method,
        registerData,
        dispatch
      );
      if (response.success) {
        dispatch(showToast({ message: response.message, variant: "success" }));
        setActiveStep(1);
      }
    } else {
      const otpNumber = parseInt(registerData.OTP, 10);
      if (isNaN(otpNumber)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          OTP: "Invalid OTP format",
        }));
        return;
      }

      const response = await apiRequest(
        ApiURLS.ActivateUser.url,
        ApiURLS.ActivateUser.method,
        { Email: registerData.Email, OTP: registerData.OTP },
        dispatch
      );
      if (response.success) {
        dispatch(showToast({ message: response.message, variant: "success" }));
        dispatch(login(response.data.user));
        navigate("/");
      }
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={6} sx={{ padding: 4, marginTop: 8 }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box
          component="form"
          className="mt-[25px]"
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          {activeStep === 0 ? (
            <>
              <TextField
                label="FullName"
                variant="outlined"
                name="FullName"
                value={registerData.FullName}
                onChange={onChange}
                fullWidth
                error={!!errors.FullName}
                helperText={errors.FullName}
              />
              <TextField
                label="Email"
                variant="outlined"
                name="Email"
                type="Email"
                value={registerData.Email}
                onChange={onChange}
                fullWidth
                error={!!errors.Email}
                helperText={errors.Email}
              />
              <TextField
                label="Password"
                variant="outlined"
                name="Password"
                type={showPassword ? "text" : "Password"}
                value={registerData.Password}
                onChange={onChange}
                fullWidth
                error={!!errors.Password}
                helperText={errors.Password}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword((prev) => !prev)}
                      >
                        {showPassword ? <IoEyeOutline /> : <FaEyeSlash />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </>
          ) : (
            <TextField
              label="Enter OTP"
              variant="outlined"
              name="OTP"
              value={registerData.OTP}
              onChange={onChange}
              fullWidth
              error={!!errors.OTP}
              helperText={errors.OTP}
            />
          )}

          <Button
            onClick={handleNext}
            variant="contained"
            color="primary"
            fullWidth
          >
            {activeStep === 0 ? "Next" : "Verify & Register"}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Register;
