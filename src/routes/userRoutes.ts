import { Router } from "express";
import verifyAdminToken from "../middleware/verifyToken";
import { createGroceryItem } from "../controllers/user";
const router = Router();

router.post("/grocery-items", verifyAdminToken, createGroceryItem);

export default router;
