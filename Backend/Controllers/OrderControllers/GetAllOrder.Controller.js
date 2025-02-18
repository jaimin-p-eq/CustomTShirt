import Order from "../../models/Order.model.js";
import ApiResponse from "../../Utils/ApiResponse.js";

const GetAllOrder = async (req, res) => {
  try {
    // Find all orders and populate 'ProductId' and 'CustomerId' fields
    const orders = await Order.find({})
      .populate("ProductId") // Populate the ProductId field
      .populate("CustomerId") // Populate the CustomerId field
      .exec();

    // Return response with populated orders
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
