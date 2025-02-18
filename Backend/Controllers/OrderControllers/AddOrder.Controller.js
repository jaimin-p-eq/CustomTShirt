import Order from "../../models/Order.model.js";
import Product from "../../models/Product.model.js";
import ApiResponse from "../../Utils/ApiResponse.js";

const AddOrder = async (req, res) => {
  try {
    const orders = req.body;
    const CustomerId = req.user._id;

    if (!Array.isArray(orders) || orders.length === 0) {
      return ApiResponse(
        res,
        false,
        "Orders should be an array with at least one order",
        400
      );
    }

    const createdOrders = [];

    for (const orderData of orders) {
      const { Font, FontSize, Text, Color, Quantity, FinalCost, ProductId } =
        orderData;

      if (
        !ProductId ||
        !Font ||
        !FontSize ||
        !Text ||
        !Color ||
        !Quantity ||
        !FinalCost
      ) {
        return ApiResponse(res, false, "Missing required fields", 400);
      }

      // Create a new order for each item in the request body
      const newOrder = new Order({
        Font,
        FontSize,
        Text,
        Color,
        Quantity,
        FinalCost,
        ProductId,
        CustomerId,
      });

      // Save the new order to the database
      await newOrder.save();
      createdOrders.push(newOrder);

      const foundProduct = await Product.findById(ProductId);

      if (!foundProduct) {
        return ApiResponse(
          res,
          false,
          `Product with ID ${ProductId} not found`,
          400
        );
      }

      // Reduce the stock of the product
      foundProduct.Stock -= Quantity;

      if (foundProduct.Stock < 0) {
        return ApiResponse(
          res,
          false,
          `Insufficient stock for product ${ProductId}`,
          400
        );
      }

      await foundProduct.save();
    }

    return ApiResponse(
      res,
      true,
      createdOrders,
      "Orders added successfully",
      200
    );
  } catch (error) {
    return ApiResponse(res, false, error.message, 500);
  }
};

export default AddOrder;
