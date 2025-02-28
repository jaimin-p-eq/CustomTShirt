import { Router } from "express";
import {
  addOrder,
  addToCartOrder,
  cartToOrder,
  getAllCartOrder,
  getAllOrder,
  getSingleOrder,
  initiateOrder,
  updateOrderStatus,
} from "../Controllers/orderControllers.js";
import tokenVerification from "../middleware/tokenVerification.js";
import { upload } from "../middleware/multer.middleware.js";

const router = Router();
router.post(
  "/initiate-order",
  tokenVerification,
  upload.single("CustomerImg"),
  initiateOrder
);
router.post(
  "/add-to-cart-order",
  tokenVerification,
  upload.single("FinalProductImg"),
  addToCartOrder
);
router.get("/get-cart-order", tokenVerification, getAllCartOrder);
router.post("/cart-to-order", tokenVerification, cartToOrder);
router.post(
  "/add-order",
  tokenVerification,
  upload.single("FinalProductImg"),
  addOrder
);
router.patch(
  "/update-state/:id",
  (req, res, next) => tokenVerification(req, res, next, true),
  updateOrderStatus
);
router.get(
  "/single-order/:id",
  (req, res, next) => tokenVerification(req, res, next, true),
  getSingleOrder
);
router.get(
  "/get-all-orders",
  (req, res, next) => tokenVerification(req, res, next, true),
  getAllOrder
);

export default router;
