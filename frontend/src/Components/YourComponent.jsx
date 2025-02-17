import React from "react";
import { useDispatch } from "react-redux";
import { Button } from "@mui/material";
import { showToast } from "../Redux/toastSlice";

const YourComponent = () => {
  const dispatch = useDispatch();

  const triggerToast = (message, variant) => {
    dispatch(showToast({ message, variant }));
  };

  return (
    <div>
      <Button
        variant="contained"
        onClick={() => triggerToast("Success message!", "success")}
        style={{ marginBottom: 10 }}
      >
        Show Success Toast
      </Button>
    </div>
  );
};

export default YourComponent;
