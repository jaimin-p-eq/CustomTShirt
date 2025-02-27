import Product from "../models/productModel.js";
import apiResponse from "./apiResponse.js";

export default async function productValidate(ProductId, res, Quantity) {
  const ExistedProduct = await Product.findById(ProductId);

  if (!ExistedProduct) {
    return apiResponse(res, false, null, "Product is not valid", 400);
  }

  if (Quantity > ExistedProduct.Stock) {
    return apiResponse(res, false, null, "Stock is not available", 400);
  } else {
    return ExistedProduct;
  }
}
