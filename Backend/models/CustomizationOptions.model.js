import { Schema, model } from "mongoose";

const CustomizationOptionsSchema = new Schema({
  FontOptions: {
    type: Map,
    of: Number,
    required: true,
  },
  TextStyles: {
    type: Map,
    of: Number,
    // Bold, Italic, Underline, Regular
  },
});

const CustomizationOptions = model(
  "CustomizationOptions",
  CustomizationOptionsSchema
);

export default CustomizationOptions;
