import ApiResponse from "../../Utils/ApiResponse.js";
import { connectRedis } from "../../redisConnection.js";
import Order from "../../models/Order.model.js";

const CartToOrder = async (req, res) => {
  // Extract data from the req.body
  // add into mongodb
  // remove the redis hash

  try {
    const data = req.body;
    const CustomerId = req.user._id;
    const redisClient = await connectRedis();

    for (const order of data) {
      const { key, orderData } = order;

      const {
        ProductId,
        CustomerImg = "",
        Font = "",
        FontSize,
        Text = "",
        Color = "",
        Quantity,
        FinalCost,
        FinalProductImg = "",
      } = orderData;

      const newOrder = new Order({
        ProductId,
        CustomerId,
        CustomerImg,
        Font,
        FontSize,
        Text,
        Color,
        FinalProductImg,
        Quantity,
        FinalCost,
        Status: "Process",
      });

      await newOrder.save();

      await redisClient.del(key);
    }

    return ApiResponse(
      res,
      true,
      null,
      "Orders successfully saved and Redis hashes removed.",
      200
    );
  } catch (error) {
    console.error(error);
    return ApiResponse(res, false, null, error.message, 500);
  }
};

export default CartToOrder;
