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
exports.updateGroceryItem = exports.getGroceryItem = exports.deleteGroceryItem = exports.createGroceryItem = void 0;
const client_1 = __importDefault(require("../utils/client"));
// ADMIN
const createGroceryItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, description, price } = req.body;
    try {
        const newItem = yield client_1.default.groceryItem.create({
            data: {
                name,
                description,
                price,
            },
        });
        res.status(201).json({
            message: "item added sucessfully",
            newItem,
        });
    }
    catch (err) {
        console.log("Error creating grocery item", err);
        res.status(500).json({ err: "failed to create grocery item" });
    }
});
exports.createGroceryItem = createGroceryItem;
const deleteGroceryItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        if (!id) {
            res.status(400).json({
                message: "ID is required to delete a grocery item",
            });
            return;
        }
        const existItem = yield client_1.default.groceryItem.findUnique({
            where: { id: Number(id) },
        });
        if (!existItem) {
            res.status(404).json({ message: "Grocery item not found" });
            return;
        }
        const removedItem = yield client_1.default.groceryItem.delete({
            where: { id: Number(id) },
        });
        res.status(200).json({
            message: "Grocery item removed successfully",
            removedItem,
        });
    }
    catch (err) {
        console.log("Failed to delete grocery item: ", err);
        res.status(500).json({ error: "Failed to delete grocery item" });
    }
});
exports.deleteGroceryItem = deleteGroceryItem;
const getGroceryItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const items = yield client_1.default.groceryItem.findMany();
        res.status(200).json(items);
    }
    catch (err) {
        console.log("Error getting the grocery item", err);
        res.status(500).json({ err: "failed to get the grocery item" });
    }
});
exports.getGroceryItem = getGroceryItem;
const updateGroceryItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { name, description, price } = req.body;
    try {
        if (!id) {
            res
                .status(400)
                .json({ message: "ID is required to update a grocery item" });
            return;
        }
        if (!name && !description && !price) {
            res.status(400).json({
                message: "At least one field is required to update a grocery item",
            });
            return;
        }
        const existingItem = yield client_1.default.groceryItem.findUnique({
            where: { id: Number(id) },
        });
        if (!existingItem) {
            res.status(404).json({ message: "Grocery item not found" });
            return;
        }
        // update the item
        const updatedItem = yield client_1.default.groceryItem.update({
            where: { id: Number(id) },
            data: Object.assign(Object.assign(Object.assign({}, (name && { name })), (description && { description })), (price && { price })),
        });
        res.status(200).json({ message: "Item updated sucessfully", updatedItem });
    }
    catch (err) {
        console.log("Error updating the the grocery item", err);
        res.status(500).json;
    }
});
exports.updateGroceryItem = updateGroceryItem;
//# sourceMappingURL=user.js.map