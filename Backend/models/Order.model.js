import mongoose, { model, Schema } from "mongoose";

const OrderSchema = Schema({
  ProductId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
  CustomerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
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
    require: true,
  },
  Status: {
    type: String,
    enum: ["Process", "Ready", "Shipped", "Completed"],
    default: "Process",
  },
});

const Order = model("Order", OrderSchema);

export default Order;
