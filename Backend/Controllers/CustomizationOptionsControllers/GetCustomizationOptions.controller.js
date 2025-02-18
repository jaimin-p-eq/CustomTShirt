import CustomizationOptions from "../../models/CustomizationOptions.model.js";
import ApiResponse from "../../utils/ApiResponse.js";

const GetCustomizationOptions = async (req, res) => {
  try {
    let customizationOptions = await CustomizationOptions.findOne({});

    return ApiResponse(
      res,
      true,
      customizationOptions,
      "Customization options Fetched successfully"
    );
  } catch (error) {
    return ApiResponse(res, false, null, error.message, 500);
  }
};

export default GetCustomizationOptions;
