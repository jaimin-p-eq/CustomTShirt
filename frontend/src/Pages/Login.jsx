import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../Redux/UserSlice";
import { showToast } from "../Redux/toastSlice";
import { IoEyeOutline } from "react-icons/io5";
import { FaEyeSlash } from "react-icons/fa6";
import ApiURLS from "../Data/ApiURLS";
import { apiRequest } from "../utils/apiRequest";
import {
  TextField,
  Button,
  Typography,
  Paper,
  IconButton,
  InputAdornment,
  Container,
  Box,
} from "@mui/material";

const Login = () => {
  const [loginData, setLoginData] = useState({
    Email: "",
    Password: "",
    OTP: "",
  });
  const [errors, setErrors] = useState({ Email: "", Password: "", OTP: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpButtonDisabled, setIsOtpButtonDisabled] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const EmailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const onChange = (e) => {
    const { name, value } = e.target;
    setErrors((prevData) => ({ ...prevData, [name]: "" }));
    setLoginData((prevData) => ({ ...prevData, [name]: value }));
  };

  const validateForm = () => {
    let formValid = true;
    const newErrors = { Email: "", Password: "", OTP: "" };

    if (!EmailRegex.test(loginData.Email)) {
      newErrors.Email = "Invalid Email format";
      formValid = false;
    }

    if (!isOtpSent && loginData.Password.length < 6) {
      newErrors.Password = "Password must be at least 6 characters long";
      formValid = false;
    }

    if (isOtpSent && !loginData.OTP) {
      newErrors.OTP = "Enter the OTP sent to your email";
      formValid = false;
    }

    setErrors(newErrors);
    return formValid;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    let requestData = { Email: loginData.Email };

    if (isOtpSent) {
      requestData.OTP = loginData.OTP;
    } else {
      requestData.Password = loginData.Password;
    }

    const response = await apiRequest(
      ApiURLS.Login.url,
      ApiURLS.Login.method,
      requestData,
      dispatch
    );

    if (response.success) {
      navigate("/");
    }
  };

  const handleSendOtp = async () => {
    if (!EmailRegex.test(loginData.Email)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        Email: "Enter a valid email",
      }));
      return;
    }

    setIsOtpButtonDisabled(true);

    const response = await apiRequest(
      ApiURLS.SendingMailForLogin.url,
      ApiURLS.SendingMailForLogin.method,
      { Email: loginData.Email },
      dispatch
    );
    if (response.success) {
      setIsOtpSent(true);
      dispatch(showToast({ message: response.message, variant: "success" }));
    } else {
      setIsOtpButtonDisabled(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={6} sx={{ padding: 4, marginTop: 8 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Login
        </Typography>

        <Box
          component="form"
          onSubmit={handleLogin}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <TextField
            label="Email"
            type="email"
            name="Email"
            value={loginData.Email}
            onChange={onChange}
            fullWidth
            error={!!errors.Email}
            helperText={errors.Email}
            variant="outlined"
          />

          {!isOtpSent ? (
            <TextField
              label="Password"
              type={showPassword ? "text" : "password"}
              name="Password"
              value={loginData.Password}
              onChange={onChange}
              fullWidth
              error={!!errors.Password}
              helperText={errors.Password}
              variant="outlined"
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
          ) : (
            <TextField
              label="OTP"
              type="text"
              name="OTP"
              value={loginData.OTP}
              onChange={onChange}
              fullWidth
              error={!!errors.OTP}
              helperText={errors.OTP}
              variant="outlined"
            />
          )}

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            {isOtpSent ? "Verify OTP & Login" : "Login"}
          </Button>

          {!isOtpSent && (
            <Button
              variant="outlined"
              color="primary"
              fullWidth
              onClick={handleSendOtp}
              disabled={isOtpButtonDisabled}
              sx={{ mt: 2 }}
            >
              Login Using OTP
            </Button>
          )}
        </Box>

        <Typography variant="body2" align="center" sx={{ mt: 3 }}>
          Don't have an account?{" "}
          <span
            onClick={() => navigate("/register")}
            style={{ cursor: "pointer", color: "#1976d2" }}
          >
            Register Here
          </span>
        </Typography>
      </Paper>
    </Container>
  );
};

export default Login;
