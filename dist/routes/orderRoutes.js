"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const order_1 = require("../controllers/order");
const router = (0, express_1.Router)();
router.post("/create", order_1.createOrder);
exports.default = router;
//# sourceMappingURL=orderRoutes.js.map