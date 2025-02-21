import ApiResponse from "../../Utils/ApiResponse.js";
import ProductValidate from "../../Utils/ProductValidate.js";
import { connectRedis } from "../../redisConnection.js";

const InitiateOrder = async (req, res) => {
  try {
    if (!req.file) {
      return ApiResponse(res, false, "No file uploaded for CustomerImg", 400);
    }

    const CustomerImg = req.file.path;
    const CustomerId = req.user._id;
    const { ProductId } = req.body;

    if (!ProductId) {
      return ApiResponse(res, false, "ProductId is required", 400);
    }

    const redisClient = await connectRedis();

    const OrderKey = `order:${CustomerId}:${Date.now()}`;

    await ProductValidate(ProductId, res);

    await redisClient.hSet(`${OrderKey}`, {
      ProductId: `${ProductId}`,
      CustomerId: `${CustomerId}`,
      CustomerImg: `${CustomerImg}`,
    });

    return ApiResponse(
      res,
      true,
      {
        OrderKey,
        ProductId,
        CustomerId,
        CustomerImg,
      },
      `Order initiated and stored in Redis successfully with Redis Key: ${OrderKey}`,
      200
    );
  } catch (error) {
    console.error(error);
    return ApiResponse(res, false, null, error.message, 500);
  }
};

export default InitiateOrder;
