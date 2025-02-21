import ApiResponse from "../../Utils/ApiResponse.js";
import { connectRedis } from "../../redisConnection.js";

const AddToCartOrder = async (req, res) => {
  try {
    const { OrderKey, Quantity, FinalCost } = req.body;
    const FinalProductImg = req.file.path;

    if (!FinalProductImg) {
      return ApiResponse(res, false, "FinalProductImg are required", 400);
    }
    if (!FinalCost) {
      return ApiResponse(res, false, "FinalCost are required", 400);
    }

    const redisClient = await connectRedis();
    const CustomerId = req.user._id;

    if (!OrderKey) {
      // OrderKey is not given means the product's customization is text type
      const { ProductId, Font, FontSize, Text, Color } = req.body;

      if (!ProductId) {
        return ApiResponse(res, false, "ProductId is required", 400);
      }

      await redisClient.hSet(OrderKey, {
        ProductId,
        CustomerId,
        Font: Font || "",
        FontSize: FontSize || 0,
        Text: Text || "",
        Color: Color || "",
        Quantity: Number(Quantity) || 1,
        FinalCost: Number(FinalCost),
        FinalProductImg: FinalProductImg || "",
      });

      return ApiResponse(
        res,
        true,
        {
          OrderKey,
          ProductId,
          Font,
          FontSize,
          Text,
          Color,
          Quantity,
          FinalCost,
          FinalProductImg,
        },
        `Order data added successfully with Redis Key: ${OrderKey}`,
        200
      );
    } else {
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

      await redisClient.hSet(OrderKey, {
        Quantity: Number(Quantity) || 1,
        FinalCost: Number(FinalCost),
        FinalProductImg: FinalProductImg || "",
      });

      return ApiResponse(
        res,
        true,
        {
          orderDetails: {
            ...orderDetails,
            Quantity,
            FinalCost,
            FinalProductImg,
          },
        },
        `Order data updated successfully for Redis Key: ${OrderKey}`,
        200
      );
    }
  } catch (error) {
    console.error(error);
    return ApiResponse(res, false, null, error.message, 500);
  }
};

export default AddToCartOrder;
