"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyAdminToken = (req, res, next) => {
    var _a;
    const token = (_a = req.headers["authorization"]) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
    if (!token) {
        res.status(403).send("A token is required for authentication");
        return;
    }
    jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            res.status(401).send("Invalid Token");
            return;
        }
        const user = decoded;
        if (user.role !== "ADMIN") {
            console.log("NOT AN ADMIN");
            res.status(403).send("Access denied");
            return;
        }
        req.user = user;
        if (user) {
            console.log("HAS ADMIN RIGHTS");
        }
        next();
    });
};
exports.default = verifyAdminToken;
//# sourceMappingURL=verifyToken.js.map