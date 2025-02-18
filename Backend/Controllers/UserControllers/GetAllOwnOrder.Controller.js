import mongoose from "mongoose";
import Order from "../../models/Order.model.js";
import ApiResponse from "../../Utils/ApiResponse.js";

const GetAllOwnOrder = async (req, res) => {
  try {
    const customerId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(customerId)) {
      return ApiResponse(res, false, null, "Invalid user ID", 400);
    }

    const customerObjectId = new mongoose.Types.ObjectId(customerId);

    const pipeline = [
      {
        $match: {
          CustomerId: customerObjectId,
        },
      },
      {
        $sort: {
          orderDate: -1,
        },
      },
      {
        $project: {
          orderId: 1,
          Font: 1,
          Text: 1,
          Color: 1,
          Quantity: 1,
          FinalCost: 1,
          Status: 1,
        },
      },
    ];

    const result = await Order.aggregate(pipeline);

    if (result.length > 0) {
      ApiResponse(res, true, result, "Orders fetched successfully");
    } else {
      ApiResponse(res, false, null, "No orders found for this customer", 404);
    }
  } catch (error) {
    ApiResponse(res, false, null, `Error: ${error.message}`, 500);
  }
};

export default GetAllOwnOrder;
