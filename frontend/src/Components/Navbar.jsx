import Avatar from "@mui/material/Avatar";
import React from "react";

function stringToColor(string) {
  let hash = 0;
  let i;
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }

  return color;
}

function stringAvatar(name) {
  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`,
  };
}

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
          <Avatar {...stringAvatar("Jaimin Praajapati")} />
        </div>
      </div>
      <hr />
    </div>
  );
};

export default Navbar;
