import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  open: false,
  message: "",
  variant: "info", // variant can be 'success', 'error', 'info', or 'warning'
};

const toastSlice = createSlice({
  name: "toast",
  initialState,
  reducers: {
    showToast: (state, action) => {
      state.message = action.payload.message;
      state.variant = action.payload.variant || "info";
      state.open = true;
    },
    hideToast: (state) => {
      state.open = false;
      state.message = "";
      state.variant = "info";
    },
  },
});

export const { showToast, hideToast } = toastSlice.actions;

export default toastSlice.reducer;
