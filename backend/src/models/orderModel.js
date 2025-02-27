import mongoose, { model, Schema } from "mongoose";

const OrderSchema = Schema({
  ProductId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    require: true,
  },
  CustomerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    require: true,
  },
  CustomerImg: {
    type: String,
  },
  Font: {
    type: String,
  },
  FontSize: {
    type: Number,
  },
  Text: {
    type: String,
  },
  Color: {
    type: String,
  },
  FinalProductImg: {
    type: String,
  },
  Quantity: {
    type: Number,
    default: 1,
  },
  FinalCost: {
    type: Number,
  },
  Status: {
    type: String,
    enum: ["Process", "Ready", "Shipped", "Completed", "Rejected"],
    default: "Process",
  },
});

const Order = model("Order", OrderSchema);

export default Order;
