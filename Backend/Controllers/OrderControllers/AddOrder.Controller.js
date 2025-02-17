import Order from "../../models/Order.model.js";
import Product from "../../models/Product.model.js";
import ApiResponse from "../../Utils/ApiResponse.js";

const AddOrder = async (req, res) => {
  try {
    const {
      Font,
      Text,
      Color,
      Quantity,
      FinalCost,
      State,
      BaseProduct,
      Customer,
    } = req.body;

    if (!BaseProduct || !Customer || !FinalCost) {
      return ApiResponse(res, false, "Missing required fields", 400);
    }

    const newOrder = new Order({
      Font,
      Text,
      Color,
      Quantity,
      FinalCost,
      State,
      BaseProduct,
      Customer,
    });

    await newOrder.save();

    const FoundProduct = await Product.findById(BaseProduct);

    if (!FoundProduct) {
      return ApiResponse(res, false, "Product not found", 400);
    }

    // Reduce Order Functionality
    FoundProduct.Stock = FoundProduct.Stock - Quantity;
    await FoundProduct.save();

    const populatedOrder = await Order.findById(newOrder._id)
      .populate("BaseProduct")
      .populate("Customer")
      .exec();

    return ApiResponse(
      res,
      true,
      populatedOrder,
      "Order added successfully",
      200
    );
  } catch (error) {
    return ApiResponse(res, false, error.message, 500);
  }
};

export default AddOrder;
