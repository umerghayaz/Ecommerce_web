import express from "express";
import { validateCoupon, getCoupon } from "../controllers/couponController.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();
router.get("/", protectRoute, getCoupon);
router.post("/validate", protectRoute, validateCoupon);

export default router;
