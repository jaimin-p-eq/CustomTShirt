import CustomizationOptions from "../models/CustomizationOptions.model.js";
import ApiResponse from "../Utils/ApiResponse.js";

const AddCustomizationOptions = async (req, res) => {
  const { FontOptions, TextStyles } = req.body;

  try {
    let customizationOptions = await CustomizationOptions.findOne({});

    if (!customizationOptions) {
      customizationOptions = new CustomizationOptions({
        FontOptions: new Map(Object.entries(FontOptions)),
        TextStyles: new Map(Object.entries(TextStyles)),
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

    if (FontOptions) {
      for (const [key, value] of Object.entries(FontOptions)) {
        customizationOptions.FontOptions.set(key, value);
      }
    }

    if (TextStyles) {
      for (const [key, value] of Object.entries(TextStyles)) {
        customizationOptions.TextStyles.set(key, value);
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

export {
  AddCustomizationOptions,
  DeleteCustomizationOptions,
  GetCustomizationOptions,
};
