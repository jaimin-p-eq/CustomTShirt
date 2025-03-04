import React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SidebarData from "../Data/SidebarData";
import { Button } from "@mui/material";

const ProductSidebar = ({ setFilterOptions, filterOptions }) => {
  const handleCheckboxChange = (category, option) => {
    const updatedFilterOptions = { ...filterOptions };
    const options = updatedFilterOptions[category];

    if (options.includes(option)) {
      updatedFilterOptions[category] = options.filter((opt) => opt !== option);
    } else {
      updatedFilterOptions[category] = [...options, option];
    }

    setFilterOptions(updatedFilterOptions);
  };

  const ClearFilter = () => {
    const initialFilterOptions = {
      Size: [],
      Sleeve: [],
      CustomizeOption: [],
      Color: [],
    };
    setFilterOptions(initialFilterOptions);
  };

  return (
    <div className="w-[15vw] h-[100vh] hidden sm:block p-4 border-r dark:bg-gray-900">
      <div className="flex justify-between">
        <h1 className="text-xl font-bold mt-2 mb-4">Filters</h1>
      </div>
      {SidebarData.map((data) => (
        <Accordion defaultExpanded key={data.title}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls={`${data.title}-content`}
            id={`${data.title}-header`}
          >
            <Typography component="span">{data.title}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <div className="flex flex-col gap-2">
              {data.Options.map((option, idx) => (
                <label key={idx} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    className="w-4 h-4"
                    checked={filterOptions[data.title]?.includes(option)}
                    onChange={() => handleCheckboxChange(data.title, option)}
                  />
                  <span className="text-sm">{option}</span>
                </label>
              ))}
            </div>
          </AccordionDetails>
        </Accordion>
      ))}
      <div className="mt-2">
        <Button variant="contained" onClick={ClearFilter}>
          Clear Filter
        </Button>
      </div>
    </div>
  );
};

export default ProductSidebar;
