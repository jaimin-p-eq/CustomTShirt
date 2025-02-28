import Order from "../models/orderModel.js";
import { connectRedis } from "../config/redisConnection.js";
import apiResponse from "../Utils/apiResponse.js";
import productValidate from "../Utils/productValidate.js";
import { sendOrderConfirmationEmail } from "../Utils/sendMail.js";

const addOrder = async (req, res) => {
  try {
    const { OrderKey, Quantity, FinalCost } = req.body;
    const FinalProductImg = req.file.path;
    const CustomerId = req.user._id;

    if (!FinalProductImg) {
      return apiResponse(
        res,
        false,
        null,
        "Final Product Image is required",
        400
      );
    }

    if (!FinalCost) {
      return apiResponse(res, false, null, "FinalCost is required", 400);
    }

    const { Email, FullName } = req.user;

    if (!OrderKey) {
      const { ProductId, Font, FontSize, Text, Color } = req.body;

      const { Size } = productValidate(ProductId, res, Quantity);

      const newOrder = new Order({
        ProductId,
        CustomerId,
        Font,
        FontSize,
        Text,
        Color,
        Quantity,
        FinalCost,
        FinalProductImg,
      });

      await newOrder.save();

      await sendOrderConfirmationEmail(
        Email,
        FullName,
        [newOrder],
        [FinalProductImg]
      );

      return apiResponse(res, true, newOrder, "Order is Successfully placed");
    } else {
      const redisClient = await connectRedis();
      const orderDetails = await redisClient.hGetAll(OrderKey);

      if (!orderDetails || Object.keys(orderDetails).length === 0) {
        return apiResponse(
          res,
          false,
          null,
          "No order found for the provided OrderKey",
          404
        );
      }

      const { ProductId, CustomerImg } = orderDetails;
      const { Size } = productValidate(ProductId, res, orderDetails.Quantity);

      const newOrder = new Order({
        ProductId,
        CustomerImg,
        CustomerId,
        Quantity,
        FinalCost,
        FinalProductImg,
      });

      await newOrder.save();
      await redisClient.del(OrderKey);

      await sendOrderConfirmationEmail(
        Email,
        FullName,
        [newOrder],
        [FinalProductImg]
      );

      return apiResponse(
        res,
        true,
        newOrder,
        "Order is Successfully placed",
        200
      );
    }
  } catch (error) {
    return apiResponse(res, false, null, error.message, 500);
  }
};

const addToCartOrder = async (req, res) => {
  try {
    const { OrderKey, Quantity, FinalCost } = req.body;
    const FinalProductImg = req.file.path;

    if (!FinalProductImg) {
      return apiResponse(res, false, null, "FinalProductImg is required", 400);
    }
    if (!FinalCost) {
      return apiResponse(res, false, null, "FinalCost is required", 400);
    }

    const redisClient = await connectRedis();
    const CustomerId = req.user._id;

    if (!OrderKey) {
      // OrderKey is not given means the product's customization is text type
      const { ProductId, Font, FontSize, Text, Color } = req.body;

      if (!(ProductId || Font || FontSize || Text || Color)) {
        return apiResponse(res, false, null, "All fields are required", 400);
      }

      await productValidate(ProductId, res, Quantity);
      const newOrderKey = `order:${CustomerId}:${Date.now()}`;

      await redisClient.hSet(newOrderKey, {
        ProductId: String(ProductId),
        CustomerId: String(CustomerId),
        Font: String(Font || ""),
        FontSize: Number(FontSize) || 0,
        Text: String(Text || ""),
        Color: String(Color || ""),
        Quantity: Number(Quantity) || 1,
        FinalCost: Number(FinalCost),
        FinalProductImg: String(FinalProductImg || ""),
      });

      return apiResponse(
        res,
        true,
        {
          ProductId,
          Font,
          FontSize,
          Text,
          Color,
          Quantity,
          FinalCost,
          FinalProductImg,
        },
        `Order is successfully added to cart`,
        200
      );
    } else {
      const orderDetails = await redisClient.hGetAll(OrderKey);

      if (!orderDetails || Object.keys(orderDetails).length === 0) {
        return apiResponse(
          res,
          false,
          null,
          "No order found for the provided OrderKey",
          404
        );
      }

      await productValidate(orderDetails.ProductId, res, Quantity);

      await redisClient.hSet(OrderKey, {
        Quantity: Number(Quantity || 1),
        FinalCost: Number(FinalCost),
        FinalProductImg: String(FinalProductImg || ""),
      });

      return apiResponse(
        res,
        true,
        {
          ...orderDetails,
          Quantity: Number(Quantity || 1),
          FinalCost: Number(FinalCost),
          FinalProductImg: String(FinalProductImg || ""),
        },
        `Order is successfully updated in the cart`,
        200
      );
    }
  } catch (error) {
    console.log(error);
    return apiResponse(res, false, null, error.message, 500);
  }
};

const cartToOrder = async (req, res) => {
  try {
    const { keys } = req.body;
    const CustomerId = req.user._id;
    const redisClient = await connectRedis();
    const Orders = [];

    const { Email, FullName } = req.user;

    for (const key of keys) {
      const orderData = await redisClient.hGetAll(key);

      if (!orderData || Object.keys(orderData).length === 0) {
        continue;
      }

      const {
        ProductId,
        CustomerImg = "",
        Font = "",
        FontSize = 0,
        Text = "",
        Color = "",
        Quantity = 1,
        FinalCost,
        FinalProductImg = "",
      } = orderData;

      const newOrder = new Order({
        ProductId,
        CustomerId,
        CustomerImg,
        Font,
        FontSize: Number(FontSize),
        Text,
        Color,
        FinalProductImg,
        Quantity: Number(Quantity),
        FinalCost: Number(FinalCost),
        Status: "Process",
      });

      const SavedOrder = await newOrder.save();
      Orders.push(SavedOrder);

      await redisClient.del(key);
    }

    await sendOrderConfirmationEmail(
      Email,
      FullName,
      Orders,
      Orders.map((order) => order.FinalProductImg)
    );

    return apiResponse(res, true, Orders, "Orders successfully purchased", 200);
  } catch (error) {
    return apiResponse(res, false, null, error.message, 500);
  }
};

const getAllCartOrder = async (req, res) => {
  try {
    const CustomerId = req.user._id;

    const redisClient = await connectRedis();

    const keys = await redisClient.keys(`order:${CustomerId}:*`);

    const orders = [];

    for (const key of keys) {
      const orderData = await redisClient.hGetAll(key);

      if (orderData.CustomerId === String(CustomerId)) {
        orders.push({
          key,
          orderData,
        });
      }
    }

    return apiResponse(
      res,
      true,
      orders,
      `Cart Orders fetched successfully`,
      200
    );
  } catch (error) {
    console.error(error);
    return apiResponse(res, false, null, error.message, 500);
  }
};

const getAllOrder = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate("ProductId")
      .populate("CustomerId")
      .exec();

    return apiResponse(
      res,
      true,
      orders,
      "All Orders Fetched Successfully",
      200
    );
  } catch (error) {
    return apiResponse(res, false, null, error.message, 500);
  }
};

const getSingleOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const SingleOrder = await Order.findById(id);

    const populatedOrder = await Order.findById(SingleOrder._id)
      .populate("ProductId")
      .populate("CustomerId")
      .exec();

    return apiResponse(
      res,
      true,
      populatedOrder,
      "Product Fetched successfully",
      200
    );
  } catch (error) {
    return apiResponse(res, false, null, error.message, 500);
  }
};

const initiateOrder = async (req, res) => {
  try {
    if (!req.file) {
      return apiResponse(res, false, null, "CustomerImg is missing", 400);
    }

    const CustomerImg = req.file.path;
    const CustomerId = req.user._id;
    const { ProductId } = req.body;

    if (!ProductId) {
      return apiResponse(
        res,
        false,
        null,
        "Please provide a valid ProductId",
        400
      );
    }

    const redisClient = await connectRedis();

    const OrderKey = `order:${CustomerId}:${Date.now()}`;

    await productValidate(ProductId, res);

    await redisClient.hSet(`${OrderKey}`, {
      ProductId: `${ProductId}`,
      CustomerId: `${CustomerId}`,
      CustomerImg: `${CustomerImg}`,
    });

    await redisClient.expire(OrderKey, 3600);

    return apiResponse(
      res,
      true,
      {
        OrderKey,
        ProductId,
        CustomerId,
        CustomerImg,
      },
      "Your order has been successfully initiated",
      200
    );
  } catch (error) {
    console.error(error);
    return apiResponse(res, false, null, error.message, 500);
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await Order.findById(id);
    if (!order) {
      return apiResponse(res, false, null, "Order not found", 404);
    }

    order.status = status;
    const updatedOrder = await order.save();

    return apiResponse(
      res,
      true,
      updatedOrder,
      `Order status updated to '${status}' successfully`,
      200
    );
  } catch (error) {
    return apiResponse(res, false, null, error.message, 500);
  }
};

export {
  addOrder,
  addToCartOrder,
  cartToOrder,
  getAllCartOrder,
  getAllOrder,
  getSingleOrder,
  initiateOrder,
  updateOrderStatus,
};
