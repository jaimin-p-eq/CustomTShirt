import { Router } from "express";
import RegisterUser from "../Controllers/UserControllers/RegisterUser.Controller.js";
import UpdateUser from "../Controllers/UserControllers/UpdateUser.Controller.js";
import LoginUser from "../Controllers/UserControllers/LoginUser.Controller.js";
import DeleteUser from "../Controllers/UserControllers/DeleteUser.Controller.js";
import VerifyJWT from "../middleware/VerifyJWT.js";
import LogoutUser from "../Controllers/UserControllers/LogoutUser.Controller.js";
import VerifyUser from "../Controllers/UserControllers/VerifyUser.Controller.js";
import SendingMailForLoginUser from "../Controllers/UserControllers/SendingMailForLoginUser.Controller.js";
import MakeAdmin from "../Controllers/UserControllers/MakeAdmin.Controller.js";
import VerifyAdmin from "../middleware/VerifyAdmin.js";
import GetSingleUser from "../Controllers/UserControllers/GetSingleUser.Controller.js";
import RefreshAccessToken from "../Controllers/UserControllers/RefreshAccessToken.controller.js";
import GetAllOwnOrder from "../Controllers/UserControllers/GetAllOwnOrder.Controller.js";

const router = Router();

// Registration
router.post("/register", RegisterUser);
router.post("/verify-user", VerifyUser);

// Login
router.post("/sending-mail-for-login", SendingMailForLoginUser);
router.post("/login", LoginUser);

router.post("/refresh-tokens", RefreshAccessToken);

// Admin Requests
router.post("/make-admin", VerifyAdmin, MakeAdmin);
router.get("/single-user/:id", VerifyAdmin, GetSingleUser);

router.post("/update-user", VerifyJWT, UpdateUser);
router.delete("/delete/:id", VerifyJWT, DeleteUser);
router.post("/logout", VerifyJWT, LogoutUser);
router.post("/get-all-own-orders", VerifyJWT, GetAllOwnOrder);

export default router;
