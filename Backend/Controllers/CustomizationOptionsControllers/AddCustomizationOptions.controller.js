import CustomizationOptions from "../../models/CustomizationOptions.model.js";
import ApiResponse from "../../utils/ApiResponse.js";

const AddCustomizationOptions = async (req, res) => {
  const { FontOptions, TextStyles } = req.body;

  try {
    let customizationOptions = await CustomizationOptions.findOne({});

    if (!customizationOptions) {
      // Create new customization options if none exist
      customizationOptions = new CustomizationOptions({
        FontOptions: new Map(Object.entries(FontOptions)), // Convert to Map format
        TextStyles: new Map(Object.entries(TextStyles)), // Convert to Map format
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

    // Update FontOptions if provided
    if (FontOptions) {
      // Loop through new FontOptions and update or add them to the existing Map
      for (const [key, value] of Object.entries(FontOptions)) {
        customizationOptions.FontOptions.set(key, value); // Set or update FontOption key-value pairs
      }
    }

    // Update TextStyles if provided
    if (TextStyles) {
      // Loop through new TextStyles and update or add them to the existing Map
      for (const [key, value] of Object.entries(TextStyles)) {
        customizationOptions.TextStyles.set(key, value); // Set or update TextStyle key-value pairs
      }
    }

    await customizationOptions.save();

    return ApiResponse(
      res,
      true,
      customizationOptions,
      "Customization options updated successfully"
    );
  } catch (error) {
    console.error(error);
    return ApiResponse(res, false, null, error.message, 500);
  }
};

export default AddCustomizationOptions;
