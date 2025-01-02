"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOrder = void 0;
const client_1 = __importDefault(require("../prisma/client"));
const createOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, items } = req.body; // items: [{ groceryItemId, quantity }]
    try {
        // Validate the user
        const user = yield client_1.default.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }
        // Validate grocery items and calculate the total price
        let total = 0;
        const orderItems = [];
        for (const item of items) {
            const groceryItem = yield client_1.default.groceryItem.findUnique({
                where: { id: item.groceryItemId },
            });
            if (!groceryItem) {
                res
                    .status(404)
                    .json({ error: `Item with ID ${item.groceryItemId} not found` });
                return;
            }
            const itemTotalPrice = groceryItem.price * item.quantity;
            total += itemTotalPrice;
            orderItems.push({
                groceryItemId: item.groceryItemId,
                quantity: item.quantity,
                price: groceryItem.price,
            });
        }
        // Create the order
        const order = yield client_1.default.order.create({
            data: {
                userId: userId,
                total: total,
                items: {
                    create: orderItems, // Create related order items
                },
            },
            include: {
                items: true, // Include order items in the response
            },
        });
        res.status(201).json(order);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Something went wrong" });
    }
});
exports.createOrder = createOrder;
//# sourceMappingURL=order.js.map