import Product from "../models/Product.model.js";
import ApiResponse from "./ApiResponse.js";

export default async function ProductValidate(ProductId, res) {
  const ExistedProduct = await Product.findById(ProductId);

  if (!ExistedProduct) {
    return ApiResponse(res, false, null, "Product is not valid", 400);
  }

  return ExistedProduct;
}
