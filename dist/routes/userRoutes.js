"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const verifyToken_1 = __importDefault(require("../middleware/verifyToken"));
const user_1 = require("../controllers/user");
const router = (0, express_1.Router)();
router.post("/grocery-items", verifyToken_1.default, user_1.createGroceryItem);
router.get("/get-grocery-items", verifyToken_1.default, user_1.getGroceryItem);
router.delete("/delete-grocery-item", verifyToken_1.default, user_1.deleteGroceryItem);
exports.default = router;
//# sourceMappingURL=userRoutes.js.map