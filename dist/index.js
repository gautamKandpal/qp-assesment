"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const app = (0, express_1.default)();
const port = 3000;
app.use("/user", userRoutes_1.default);
// app.get("/", (req, res) => {
//   res.send("from git project");
// });
app.listen(port, () => {
    console.log(`Backend is running on port: ${port}`);
});
//# sourceMappingURL=index.js.map