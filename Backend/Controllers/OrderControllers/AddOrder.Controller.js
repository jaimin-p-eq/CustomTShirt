import Order from "../../models/Order.model.js";
import Product from "../../models/Product.model.js";
import { connectRedis } from "../../redisConnection.js";
import ApiResponse from "../../Utils/ApiResponse.js";
import ProductValidate from "../../Utils/ProductValidate.js";

const AddOrder = async (req, res) => {
  try {
    const { OrderKey, Quantity, FinalCost } = req.body;
    const FinalProductImg = req.file.path;
    const CustomerId = req.user._id;

    if (!FinalProductImg) {
      return ApiResponse(
        res,
        false,
        null,
        "Final Product Image is required",
        400
      );
    }

    if (!OrderKey) {
      // OrderKey is not given means the product's customization is text type
      const { ProductId, Font, FontSize, Text, Color } = req.body;

      ProductValidate(ProductId, res);

      const newOrder = new Order({
        ProductId,
        CustomerId,
        Font,
        FontSize,
        Text,
        Color,
        Quantity,
        FinalCost,
        FinalProductImg,
      });

      await newOrder.save();

      return ApiResponse(res, true, newOrder, "Order is Sucessfully placed");
    } else {
      const redisClient = await connectRedis();
      const orderDetails = await redisClient.hGetAll(OrderKey);

      if (!orderDetails || Object.keys(orderDetails).length === 0) {
        return ApiResponse(
          res,
          false,
          null,
          "No order found for the provided OrderKey",
          404
        );
      }

      const { ProductId, CustomerImg } = orderDetails;

      const newOrder = new Order({
        ProductId,
        CustomerImg,
        CustomerId,
        Quantity,
        FinalCost,
        FinalProductImg,
      });

      await newOrder.save();
      await redisClient.del(OrderKey);

      return ApiResponse(
        res,
        true,
        newOrder,
        "Order is Sucessfully placed",
        200
      );
    }
  } catch (error) {
    return ApiResponse(res, false, null, error.message, 500);
  }
};

export default AddOrder;
