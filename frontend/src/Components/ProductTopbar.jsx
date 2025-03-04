import React from "react";
import { MenuItem, Select } from "@mui/material";
import { ListAlt } from "@mui/icons-material";

const ProductTopbar = ({ sortOrder, setSortOrder, count }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-5 w-full px-[5vw] sm:px-0">
      <h1 className="text-xl font-bold">{`${count} Products`}</h1>

      <div className="flex items-center px-3 py-1 border rounded-lg gap-3">
        {/* <ListAlt className="text-gray-500 mr-2" /> */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="1em"
          height="1em"
          fill="none"
          viewBox="0 0 18 15"
          stroke="none"
        >
          <path
            fill="#666875"
            d="M14.667.333v10h2.5L13.833 14.5 10.5 10.333H13v-10h1.667ZM8 12v1.667H.5V12H8Zm1.667-5.833v1.666H.5V6.167h9.167Zm0-5.834V2H.5V.333h9.167Z"
          ></path>
        </svg>
        <div>
          <span className="text-sm">Sort by :</span>
          <Select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="ml-2 text-sm font-semibold"
            variant="standard"
            disableUnderline
          >
            <MenuItem value="lowToHigh" className="font-bold">
              Price: Low to High
            </MenuItem>
            <MenuItem value="highToLow" className="font-bold">
              Price: High to Low
            </MenuItem>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default ProductTopbar;
