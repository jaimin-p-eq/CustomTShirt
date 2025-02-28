import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./Pages/Login";
import ToastNotification from "./Components/ToastNotification.jsx";
import Register from "./Pages/Register.jsx";
import Home from "./Pages/Home.jsx";
import AddProductForm from "./Components/AddProductForm.jsx";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { useSelector } from "react-redux";
import Navbar from "./Components/Navbar.jsx";
import Product from "./Pages/Product.jsx";
import OrderForm from "./Pages/OrderForm.jsx";

function App() {
  const mode = useSelector((state) => state.theme.mode);

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
      }),
    [mode]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<AddProductForm />} />
          <Route path="/product" element={<Product />} />
          <Route path="/orderform" element={<OrderForm />} />
        </Routes>
        <ToastNotification />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
