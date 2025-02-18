import { Router } from "express";
import VerifyJWT from "../middleware/VerifyJWT.js";
import AddOrder from "../Controllers/OrderControllers/Addorder.Controller.js";
import { upload } from "../middleware/multer.middleware.js";
import GetAllOrder from "../Controllers/OrderControllers/GetAllOrder.Controller.js";
import VerifyAdmin from "../middleware/VerifyAdmin.js";
import UpdateOrderStatus from "../Controllers/OrderControllers/UpdateOrderStatus.Controller.js";
import GetSingleOrder from "../Controllers/OrderControllers/GetSingleOrder.Controller.js";

const router = Router();

router.post(
  "/add-order",
  VerifyJWT,
  upload.fields([
    { name: "CustomerImg", maxCount: 1 },
    { name: "FinalProductImg", maxCount: 1 },
  ]),
  AddOrder
);

router.post("/update-state/:id", VerifyAdmin, UpdateOrderStatus);
router.get("/single-order/:id", VerifyAdmin, GetSingleOrder);
router.get("/get-all-orders", VerifyAdmin, GetAllOrder);

export default router;
