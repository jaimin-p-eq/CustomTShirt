import { Router } from "express";
import tokenVerification from "../middleware/tokenVerification.js";
import {
  addCustomizationOptions,
  deleteCustomizationOptions,
  getCustomizationOptions,
} from "../Controllers/customizationOptionsControllers.js";

const router = Router();

router.post(
  "/add-customization-options",
  (req, res, next) => tokenVerification(req, res, next, true),
  addCustomizationOptions
);
router.delete(
  "/delete/delete-customization-options",
  (req, res, next) => tokenVerification(req, res, next, true),
  deleteCustomizationOptions
);
router.get(
  "/get-customization-options",
  tokenVerification,
  getCustomizationOptions
);

export default router;
