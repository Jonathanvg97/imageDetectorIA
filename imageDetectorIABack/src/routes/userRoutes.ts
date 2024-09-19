import express from "express";
import {
  userCreate,
  userDelete,
  userUpdate,
} from "../controllers/userController";
import { validateEmailExists } from "../middleware/validateEmailExists";
import { userLogin } from "../controllers/authController";
import { requestPasswordReset } from "../controllers/emailController";

const router = express.Router();

router.post("/create-user", validateEmailExists, userCreate);
router.delete("/user/:userId", userDelete);
router.post("/user/:userId", userUpdate);
router.post("/login", userLogin);
router.post("/password-reset", requestPasswordReset);

export default router;
