import { Router } from "express";
import TokenVerification from "../middleware/TokenVerification.js";
import { upload } from "../middleware/multer.middleware.js";
import {
  DeleteUser,
  GetAllOwnOrder,
  GetSingleUser,
  LoginUser,
  LogoutUser,
  RefreshAccessToken,
  RegisterUser,
  SendingMailForLoginUser,
  UpdateUser,
  VerifyUser,
} from "../Controllers/UserControllers.js";
import {
  AddCustomizationOptions,
  DeleteCustomizationOptions,
  GetCustomizationOptions,
} from "../Controllers/CustomizationOptionsControllers.js";
import {
  AddOrder,
  AddToCartOrder,
  CartToOrder,
  GetAllCartOrder,
  GetAllOrder,
  GetSingleOrder,
  InitiateOrder,
  UpdateOrderStatus,
} from "../Controllers/OrderControllers.js";
import {
  AddProduct,
  DeleteProduct,
  GetAllCustomer,
  GetAllProduct,
  GetSingleProduct,
  UpdateProduct,
} from "../Controllers/ProductControllers.js";

const router = Router();

// Registration
router.post("/user/register", RegisterUser);
router.post("/user/verify-user", VerifyUser);

// Login
router.post("/user/sending-mail-for-login", SendingMailForLoginUser);
router.post("/user/login", LoginUser);

router.post("/user/refresh-tokens", RefreshAccessToken);

// Admin Requests
router.get(
  "/user/single-user/:id",
  (req, res, next) => TokenVerification(req, res, next, true),
  GetSingleUser
);

router.post("/user/update-user", TokenVerification, UpdateUser);
router.delete("/user/delete/:id", TokenVerification, DeleteUser);
router.post("/user/logout", TokenVerification, LogoutUser);
router.get("/user/get-all-own-orders", TokenVerification, GetAllOwnOrder);

router.post(
  "/customization-options/add-customization-options",
  (req, res, next) => TokenVerification(req, res, next, true),
  AddCustomizationOptions
);
router.delete(
  "/customization-options/delete/delete-customization-options",
  (req, res, next) => TokenVerification(req, res, next, true),
  DeleteCustomizationOptions
);
router.get(
  "/customization-options/get-customization-options",
  TokenVerification,
  GetCustomizationOptions
);

// Order
router.post(
  "/order/initiate-order",
  TokenVerification,
  upload.single("CustomerImg"),
  InitiateOrder
);
router.post(
  "/order/add-to-cart-order",
  TokenVerification,
  upload.single("FinalProductImg"),
  AddToCartOrder
);
router.get("/order/get-cart-order", TokenVerification, GetAllCartOrder);
router.post("/order/cart-to-order", TokenVerification, CartToOrder);
router.post(
  "/order/add-order",
  TokenVerification,
  upload.single("FinalProductImg"),
  AddOrder
);
router.post(
  "/order/update-state/:id",
  (req, res, next) => TokenVerification(req, res, next, true),
  UpdateOrderStatus
);
router.get(
  "/order/single-order/:id",
  (req, res, next) => TokenVerification(req, res, next, true),
  GetSingleOrder
);
router.get(
  "/order/get-all-orders",
  (req, res, next) => TokenVerification(req, res, next, true),
  GetAllOrder
);

// Product
router.post(
  "/product/add-product",
  (req, res, next) => TokenVerification(req, res, next, true),
  upload.array("ProductImages", 5),
  AddProduct
);
router.post(
  "/product/update-product",
  (req, res, next) => TokenVerification(req, res, next, true),
  upload.array("ProductImages", 5),
  UpdateProduct
);
router.delete(
  "/product/delete/:id",
  (req, res, next) => TokenVerification(req, res, next, true),
  DeleteProduct
);
router.get("/product/single-product/:id", TokenVerification, GetSingleProduct);
router.get("/product/get-all-products", TokenVerification, GetAllProduct);
router.get("/product/get-all-customers", TokenVerification, GetAllCustomer);

export default router;
