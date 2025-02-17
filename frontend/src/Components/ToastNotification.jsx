import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Snackbar, Alert } from "@mui/material";
import { hideToast } from "../Redux/toastSlice";

const ToastNotification = () => {
  const dispatch = useDispatch();
  const { open, message, variant } = useSelector((state) => state.toast);

  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        dispatch(hideToast());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [open, dispatch]);

  return (
    <Snackbar
      open={open}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      autoHideDuration={3000}
      onClose={() => dispatch(hideToast())}
    >
      <Alert onClose={() => dispatch(hideToast())} severity={variant}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default ToastNotification;
