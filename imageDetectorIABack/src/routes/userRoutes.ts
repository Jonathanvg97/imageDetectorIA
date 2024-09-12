import express from "express";
import { userCreate } from "../controllers/userController";
import { validateEmailExists } from "../middleware/validateEmailExists";
import { userLogin } from "../controllers/authController";

const router = express.Router();

router.post("/create-user", validateEmailExists, userCreate);
router.post("/login", userLogin);

export default router;
