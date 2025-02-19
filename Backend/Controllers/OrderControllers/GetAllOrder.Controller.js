import Order from "../../models/Order.model.js";
import ApiResponse from "../../Utils/ApiResponse.js";

const GetAllOrder = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate("ProductId")
      .populate("CustomerId")
      .exec();

    return ApiResponse(
      res,
      true,
      orders,
      "All Orders Fetched Successfully",
      200
    );
  } catch (error) {
    return ApiResponse(res, false, error.message, 500);
  }
};

export default GetAllOrder;
