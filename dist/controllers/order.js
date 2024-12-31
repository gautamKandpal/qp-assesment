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
    const { userId, items, } = req.body;
    try {
        //filtering in the basis of userId
        const user = yield client_1.default.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        //create the order
        const order = yield client_1.default.order.create({
            data: {
                userId,
                total: 0,
                items: {
                    create: items.map((item) => ({
                        groceryItemId: item.groceryItemId,
                        quantity: item.quantity,
                        price: 0,
                    })),
                },
            },
        });
        let total = 0;
        // iterates over the values
        for (let item of items) {
            const groceryItem = yield client_1.default.groceryItem.findUnique({
                where: { id: item.groceryItemId },
            });
            if (!groceryItem) {
                res.status(404).json({
                    message: `grocery item with id ${item.groceryItemId} not found`,
                });
                return;
            }
            const price = groceryItem.price * item.quantity;
            total += price;
            yield client_1.default.orderItem.updateMany({
                where: {
                    orderId: order.id,
                    groceryItemId: item.groceryItemId,
                },
                data: {
                    price,
                },
            });
        }
        //update total price
        yield client_1.default.order.update({
            where: { id: order.id },
            data: {
                total,
            },
        });
        return res
            .status(201)
            .json({ message: "Order placed successfully", order });
        // return;
    }
    catch (err) {
        console.log("Error placing order:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.createOrder = createOrder;
//# sourceMappingURL=order.js.map