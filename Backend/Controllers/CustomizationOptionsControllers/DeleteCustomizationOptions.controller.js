import CustomizationOptions from "../../models/CustomizationOptions.model.js";
import ApiResponse from "../../utils/ApiResponse.js";

const DeleteCustomizationOptions = async (req, res) => {
  const { FontOptions, TextStyles } = req.body;

  try {
    let customizationOptions = await CustomizationOptions.findOne({});

    if (!customizationOptions) {
      return ApiResponse(
        res,
        false,
        null,
        "Customization options not found",
        404
      );
    }

    if (FontOptions) {
      for (const font of FontOptions) {
        customizationOptions.FontOptions.delete(font);
      }
    }

    if (TextStyles) {
      for (const style of TextStyles) {
        customizationOptions.TextStyles.delete(style);
      }
    }

    await customizationOptions.save();

    return ApiResponse(
      res,
      true,
      customizationOptions,
      "Customization options deleted successfully"
    );
  } catch (error) {
    return ApiResponse(res, false, null, error.message, 500);
  }
};

export default DeleteCustomizationOptions;
