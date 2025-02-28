import React from "react";

const Navbar = () => {
  return (
    <div className="mb-[2vh]">
      <div className="px-[5vw] flex justify-between items-center my-5">
        <div className="flex justify-between items-center gap-5 cursor-pointer">
          <div>logo</div>
          <div>WearMyArt</div>
        </div>
        <div className="flex justify-between items-center gap-5 cursor-pointer">
          <div>Register</div>
          <div>Login</div>
        </div>
      </div>
      <hr />
    </div>
  );
};

export default Navbar;
