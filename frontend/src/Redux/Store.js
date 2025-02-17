import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./UserSlice";
import toastReducer from "./toastSlice";

const store = configureStore({
  reducer: {
    user: userSlice,
    toast: toastReducer,
  },
});

export default store;
