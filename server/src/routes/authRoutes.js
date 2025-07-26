import express from "express";
import { 
  register, 
  login, 
  logout, 
  sendVerifyOtp, 
  verifyEmail, 
  isAuthenticated, 
  sendResetOtp, 
  verifyResetOtp, 
  resetPassword 
} from "../controllers/authController.js";
import userAuth from "../middleware/userAuth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/send-reset-otp", sendResetOtp);
router.post("/verify-reset-otp", verifyResetOtp);
router.post("/reset-password", resetPassword);

router.post("/logout", userAuth, logout);
router.post("/send-verify-otp", userAuth, sendVerifyOtp);
router.post("/verify-account", userAuth, verifyEmail);
router.get("/is-auth", userAuth, isAuthenticated);

export default router;