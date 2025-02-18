import { Router } from "express";
import VerifyJWT from "../middleware/VerifyJWT.js";
import VerifyAdmin from "../middleware/VerifyAdmin.js";
import AddProduct from "../Controllers/ProductControllers/AddProduct.Controller.js";
import UpdateProduct from "../Controllers/ProductControllers/UpdateProduct.Controller.js";
import DeleteProduct from "../Controllers/ProductControllers/DeleteProduct.Controller.js";
import GetAllProduct from "../Controllers/ProductControllers/GetAllProduct.Controller.js";
import { upload } from "../middleware/multer.middleware.js";
import GetSingleProduct from "../Controllers/ProductControllers/GetSingleProduct.Controller.js";
import GetAllCustomer from "../Controllers/ProductControllers/GetAllCustomer.Controller.js";

const router = Router();

router.post("/add-product", VerifyAdmin, upload.array("images", 5), AddProduct);

router.post(
  "/update-product",
  VerifyAdmin,
  upload.array("images", 5),
  UpdateProduct
);
router.delete("/delete/:id", VerifyAdmin, DeleteProduct);
router.get("/single-product/:id", VerifyJWT, GetSingleProduct);
router.get("/get-all-products", VerifyJWT, GetAllProduct);
router.get("/get-all-customers", VerifyJWT, GetAllCustomer);
export default router;
