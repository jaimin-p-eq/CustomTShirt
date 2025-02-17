import { FaHome, FaUsers, FaCogs, FaChartBar, FaBars } from "react-icons/fa";
import React, { useState } from "react";
import { useSelector } from "react-redux";

const Navbar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const { user } = useSelector((state) => state.user);
  console.log(user);

  return (
    <div
      className={`w-${isSidebarOpen ? "64" : "20"} h-screen flex  flex-col bg-gray-800 text-white p-4 transition-all duration-300`}
    >
      <div className="flex justify-between items-center mb-4">
        <button onClick={toggleSidebar} className="text-xl pt-[3.5] p-2">
          <FaBars />
        </button>
      </div>

      <ul className="flex flex-col space-y-4">
        <li className="flex items-center py-2 hover:bg-gray-700 px-2 rounded">
          <FaHome className="text-xl mr-4" />
          {isSidebarOpen && <span className="text-lg">Dashboard</span>}
        </li>
        <li className="flex items-center py-2 hover:bg-gray-700 px-2 rounded">
          <FaUsers className="text-xl mr-4" />
          {isSidebarOpen && <span className="text-lg">Users</span>}
        </li>
        <li className="flex items-center py-2 hover:bg-gray-700 px-2 rounded">
          <FaCogs className="text-xl mr-4" />
          {isSidebarOpen && <span className="text-lg">Settings</span>}
        </li>
        <li className="flex items-center py-2 hover:bg-gray-700 px-2 rounded">
          <FaChartBar className="text-xl mr-4" />
          {isSidebarOpen && <span className="text-lg">Analytics</span>}
        </li>
      </ul>
    </div>
  );
};

export default Navbar;
