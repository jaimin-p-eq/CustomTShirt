import { Router } from "express";
import VerifyAdmin from "../middleware/VerifyAdmin.js";
import AddCustomizationOptions from "../Controllers/CustomizationOptionsControllers/AddCustomizationOptions.controller.js";
import DeleteCustomizationOptions from "../Controllers/CustomizationOptionsControllers/DeleteCustomizationOptions.controller.js";
import VerifyJWT from "../middleware/VerifyJWT.js";
import GetCustomizationOptions from "../Controllers/CustomizationOptionsControllers/GetCustomizationOptions.controller.js";

const router = Router();

router.post("/add-customization-options", VerifyAdmin, AddCustomizationOptions);
router.delete(
  "/delete/delete-customization-options",
  VerifyAdmin,
  DeleteCustomizationOptions
);
router.get("/get-customization-options", VerifyJWT, GetCustomizationOptions);

export default router;
