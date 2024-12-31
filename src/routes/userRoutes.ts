import { Router } from "express";
import verifyAdminToken from "../middleware/verifyToken";
import {
  createGroceryItem,
  getGroceryItem,
  deleteGroceryItem,
  updateGroceryItem,
} from "../controllers/user";
const router = Router();

router.post("/grocery-items", verifyAdminToken, createGroceryItem);
router.get("/get-grocery-items", getGroceryItem);

router.delete("/delete-grocery-item/:id", verifyAdminToken, deleteGroceryItem);
router.put("/update-grocery-item/:id", verifyAdminToken, updateGroceryItem);

export default router;
