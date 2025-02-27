import { model, Schema } from "mongoose";

const ProductSchema = new Schema({
  ImgURL: {
    type: [String],
    required: false,
  },
  Size: {
    type: String,
    enum: ["XXL", "XL", "L", "M", "S"],
    required: true,
  },
  Price: {
    type: Number,
    required: true,
  },
  DiscountedPrice: {
    type: Number,
  },
  Sleeve: {
    type: String,
    enum: ["full sleeve", "half sleeve", "sleeveless"],
    required: true,
  },
  Stock: {
    type: Number,
    required: true,
  },
  Color: {
    type: String,
    required: true,
  },
  CustomizeOption: {
    type: String,
    enum: ["Photo", "Text", "Both"],
    required: true,
  },
  isDiscontinued: {
    type: Boolean,
    default: false,
  },
});

const Product = model("Product", ProductSchema);

export default Product;
