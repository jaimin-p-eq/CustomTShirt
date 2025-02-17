import React from "react";

const Header = () => {
  return (
    <div className="flex bg-gray-800 text-white p-4">
      {/* Left part of the header */}
      <div className="w-64">
        <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
      </div>
      {/* Right part of the header (extends across top) */}
      <div className="flex-1 pl-4">
        <h2 className="text-xl">Welcome to your Dashboard</h2>
      </div>
    </div>
  );
};

export default Header;
