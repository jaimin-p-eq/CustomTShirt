import CustomizationOptions from "../../models/CustomizationOptions.model.js";
import ApiResponse from "../../utils/ApiResponse.js";

const AddCustomizationOptions = async (req, res) => {
  const { FontOptions, TextStyles } = req.body;

  try {
    let customizationOptions = await CustomizationOptions.findOne({});

    if (!customizationOptions) {
      // Create new customization options if none exist
      customizationOptions = new CustomizationOptions({
        FontOptions,
        TextStyles,
      });

      await customizationOptions.save();
      return ApiResponse(
        res,
        true,
        customizationOptions,
        "Customization options created successfully",
        201
      );
    }

    // Use Set to remove duplicates and add new options
    if (FontOptions) {
      // Convert both the existing FontOptions and new FontOptions to Sets to ensure uniqueness
      const updatedFontOptions = new Set([
        ...customizationOptions.FontOptions,
        ...FontOptions,
      ]);
      customizationOptions.FontOptions = Array.from(updatedFontOptions); // Convert Set back to array
    }

    if (TextStyles) {
      // Convert both the existing TextStyles and new TextStyles to Sets to ensure uniqueness
      const updatedTextStyles = new Set([
        ...customizationOptions.TextStyles,
        ...TextStyles,
      ]);
      customizationOptions.TextStyles = Array.from(updatedTextStyles); // Convert Set back to array
    }

    await customizationOptions.save();

    return ApiResponse(
      res,
      true,
      customizationOptions,
      "Customization options added successfully"
    );
  } catch (error) {
    console.error(error);
    return ApiResponse(res, false, null, error.message, 500);
  }
};

export default AddCustomizationOptions;
