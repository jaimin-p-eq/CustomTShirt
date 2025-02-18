import Order from "../../models/Order.model.js";
import ApiResponse from "../../Utils/ApiResponse.js";

const GetSingleOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const SingleOrder = await Order.findById(id);

    const populatedOrder = await Order.findById(SingleOrder._id)
      .populate("ProductId")
      .populate("CustomerId")
      .exec();

    return ApiResponse(
      res,
      true,
      populatedOrder,
      "Product Fetched successfully",
      200
    );
  } catch (error) {
    return ApiResponse(res, false, error.message, 500);
  }
};

export default GetSingleOrder;
