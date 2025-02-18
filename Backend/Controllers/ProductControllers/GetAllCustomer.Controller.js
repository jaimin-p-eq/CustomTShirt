import mongoose from "mongoose";
import Order from "../../models/Order.model.js";
import ApiResponse from "../../Utils/ApiResponse.js";

const GetAllCustomer = async (req, res) => {
  try {
    const { ProductId } = req.body;

    if (!ProductId) {
      return ApiResponse(res, false, null, "ProductId is required", 400);
    }

    // Ensure ProductId is correctly converted to an ObjectId using 'new'
    const productObjectId = new mongoose.Types.ObjectId(ProductId);

    const pipeline = [
      {
        $match: {
          ProductId: productObjectId,
        },
      },
      {
        $sort: {
          orderDate: -1,
        },
      },
      {
        $project: {
          CustomerId: 1,
        },
      },
    ];

    const result = await Order.aggregate(pipeline);

    if (result.length > 0) {
      ApiResponse(res, true, result, "Customers fetched successfully");
    } else {
      ApiResponse(res, false, null, "No customers found for this product", 404);
    }
  } catch (error) {
    ApiResponse(res, false, null, `Error: ${error.message}`, 500);
  }
};

export default GetAllCustomer;
