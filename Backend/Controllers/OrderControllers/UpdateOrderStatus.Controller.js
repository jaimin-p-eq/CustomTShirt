import ApiResponse from "../../Utils/ApiResponse.js";
import Order from "../../models/Order.model.js";

const UpdateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await Order.findById(id);
    if (!order) {
      return ApiResponse(res, false, "Order not found", 404);
    }

    order.status = status;
    const updatedOrder = await order.save();

    return ApiResponse(
      res,
      true,
      updatedOrder,
      `Order status updated to '${status}' successfully`,
      200
    );
  } catch (error) {
    return ApiResponse(res, false, error.message, 500);
  }
};

export default UpdateOrderStatus;
