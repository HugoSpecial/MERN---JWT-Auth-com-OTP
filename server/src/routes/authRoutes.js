// import express from "express";
// import { register, login, logout, sendVerifyOtp, verifyEmail, isAuthenticated, sendResetOtp, resetPassword } from "../controllers/authController.js";
// import userAuth from "../middleware/userAuth.js";


// const router = express.Router();

// router.post("/register", register);
// router.post("/login", login);
// router.post("/logout", logout);
// router.post("/send-verify-otp", userAuth, sendVerifyOtp);
//     router.post('/verify-reset-otp', verifyResetOtp);
// router.post("/verify-account", userAuth, verifyEmail);
// router.get("/is-auth", userAuth, isAuthenticated);
// router.post("/send-reset-otp", sendResetOtp);
// router.post("/reset-password", resetPassword);


// export default router;

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

// Public routes (no authentication required)
router.post("/register", register);
router.post("/login", login);
router.post("/send-reset-otp", sendResetOtp);
router.post("/verify-reset-otp", verifyResetOtp);
router.post("/reset-password", resetPassword);

// Protected routes (require authentication)
router.post("/logout", userAuth, logout);
router.post("/send-verify-otp", userAuth, sendVerifyOtp);
router.post("/verify-account", userAuth, verifyEmail);
router.get("/is-auth", userAuth, isAuthenticated);

export default router;