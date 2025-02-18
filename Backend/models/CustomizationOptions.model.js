import { Schema, model } from "mongoose";

const CustomizationOptionsSchema = new Schema({
  FontOptions: {
    type: [String],
  },
  TextStyles: {
    type: [String],
    // enum: ["Bold", "Italic", "Underline", "Regular"],
  },
});

const CustomizationOptions = model(
  "CustomizationOptions",
  CustomizationOptionsSchema
);

export default CustomizationOptions;
