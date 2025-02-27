import { Router } from "express";
import {
  addProduct,
  disContinueProducts,
  reContinueProducts,
  getAllCustomers,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  getAllActiveProducts,
  getLowStockProducts,
} from "../Controllers/productControllers.js";
import tokenVerification from "../middleware/tokenVerification.js";
import { upload } from "../middleware/multer.middleware.js";

const router = Router();

router.post(
  "/add-product",
  (req, res, next) => tokenVerification(req, res, next, true),
  upload.array("ProductImages", 5),
  addProduct
);
router.post(
  "/update-product",
  (req, res, next) => tokenVerification(req, res, next, true),
  upload.array("ProductImages", 5),
  updateProduct
);
router.post(
  "/discontinue-products",
  (req, res, next) => tokenVerification(req, res, next, true),
  disContinueProducts
);
router.post(
  "/recontinue-products",
  (req, res, next) => tokenVerification(req, res, next, true),
  reContinueProducts
);
router.get(
  "/get-low-stock-products",
  (req, res, next) => tokenVerification(req, res, next, true),
  getLowStockProducts
);
router.get("/single-product/:id", tokenVerification, getSingleProduct);
router.get(
  "/get-all-products",
  (req, res, next) => tokenVerification(req, res, next, true),
  getAllProducts
);
router.get("/get-all-active-products", tokenVerification, getAllActiveProducts);
router.get(
  "/get-all-customers",
  (req, res, next) => tokenVerification(req, res, next, true),
  getAllCustomers
);

export default router;
