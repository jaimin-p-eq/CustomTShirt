import { Router } from "express";
import VerifyJWT from "../middleware/VerifyJWT.js";
import AddOrder from "../Controllers/OrderControllers/AddOrder.Controller.js";
import { upload } from "../middleware/multer.middleware.js";
import GetAllOrder from "../Controllers/OrderControllers/GetAllOrder.Controller.js";
import VerifyAdmin from "../middleware/VerifyAdmin.js";
import UpdateOrderStatus from "../Controllers/OrderControllers/UpdateOrderStatus.Controller.js";
import GetSingleOrder from "../Controllers/OrderControllers/GetSingleOrder.Controller.js";
import InitiateOrder from "../Controllers/OrderControllers/initiateOrder.Controller.js";
import AddToCartOrder from "../Controllers/OrderControllers/AddToCartOrder.Controller.js";
import GetAllCartOrder from "../Controllers/OrderControllers/GetAllCartOrder.Controller.js";
import CartToOrder from "../Controllers/OrderControllers/CartToOrder.Controller.js";

const router = Router();

router.post(
  "/initiate-Order",
  VerifyJWT,
  upload.single("CustomerImg"),
  InitiateOrder
);

router.post(
  "/add-to-cart-order",
  VerifyJWT,
  upload.single("FinalProductImg"),
  AddToCartOrder
);

router.get("/get-cart-order", VerifyJWT, GetAllCartOrder);
router.post("/cart-to-order", VerifyJWT, CartToOrder);

router.post(
  "/add-order",
  VerifyJWT,
  upload.single("FinalProductImg"),
  AddOrder
);

router.post("/update-state/:id", VerifyAdmin, UpdateOrderStatus);
router.get("/single-order/:id", VerifyAdmin, GetSingleOrder);
router.get("/get-all-orders", VerifyAdmin, GetAllOrder);

export default router;
