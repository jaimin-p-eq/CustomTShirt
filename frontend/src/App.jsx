import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./Pages/Login";
import ToastNotification from "./Components/ToastNotification.jsx";
import Register from "./Pages/Register.jsx";
import Home from "./Pages/Home.jsx";
import Navbar from "./Components/Navbar.jsx";
import Header from "./Components/Header.jsx";

function App() {
  return (
    <BrowserRouter>
      <div className="flex">
        <Navbar />
        <div className="flex-1">
          <Header />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Home />} />
          </Routes>
        </div>
      </div>

      <ToastNotification />
    </BrowserRouter>
  );
}

export default App;
