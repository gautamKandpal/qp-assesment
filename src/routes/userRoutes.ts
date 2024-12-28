import { Router } from "express";
import verifyAdminToken from "../middleware/verifyToken";
import {
  createGroceryItem,
  getGroceryItem,
  deleteGroceryItem,
} from "../controllers/user";
const router = Router();

router.post("/grocery-items", verifyAdminToken, createGroceryItem);
router.get("/get-grocery-items", verifyAdminToken, getGroceryItem);
router.delete("/delete-grocery-item", verifyAdminToken, deleteGroceryItem);

export default router;
