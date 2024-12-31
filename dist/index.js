"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const orderRoutes_1 = __importDefault(require("./routes/orderRoutes"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config(); //to load enviroment variables
const app = (0, express_1.default)();
const port = process.env.PORT || 5000;
app.use(express_1.default.json());
app.use("/auth", authRoutes_1.default);
app.use("/user", userRoutes_1.default);
app.use("/order", orderRoutes_1.default);
app.listen(port, () => {
    console.log(`SERVER IS RUNNING ON PORT ${port} 🚀`);
});
//# sourceMappingURL=index.js.map