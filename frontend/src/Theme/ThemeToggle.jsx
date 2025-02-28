import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../Redux/themeSlice";
import { Switch } from "@mui/material";
import { DarkMode, LightMode } from "@mui/icons-material";

const ThemeToggle = () => {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.theme.mode);

  return (
    <div className="flex items-center gap-2">
      <LightMode className="text-yellow-500" />
      <Switch
        checked={theme === "dark"}
        onChange={() => dispatch(toggleTheme())}
      />
      <DarkMode className="text-gray-900" />
    </div>
  );
};

export default ThemeToggle;
