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
exports.signIn = exports.signUp = void 0;
const client_1 = __importDefault(require("../prisma/client"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_2 = require("@prisma/client");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const JWT_SECRET = process.env.JWT_SECRET;
const signUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password, role } = req.body;
    try {
        // Validate the required field
        if (!name || !email || !password) {
            res
                .status(400)
                .json({ message: "Name, email, and password are required" });
            return;
        }
        // Validate the role using Prisma's Role enum
        if (role && !Object.values(client_2.Role).includes(role)) {
            res.status(400).json({ message: "Invalid role specified." });
            return;
        }
        // Check if email is already in use
        const existingUser = yield client_1.default.user.findUnique({ where: { email } });
        if (existingUser) {
            res.status(409).json({ message: "Email is already in use." });
            return;
        }
        // Hash the password
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        // Create the new user
        const newUser = yield client_1.default.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: role || client_2.Role.USER,
            },
        });
        console.log(newUser);
        // Send a success response
        res.status(201).json({
            message: "User registered successfully.",
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
            },
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error." });
    }
});
exports.signUp = signUp;
const signIn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            res.status(400).json({
                message: "Email and password are required",
            });
        }
        const user = yield client_1.default.user.findUnique({ where: { email } });
        if (!user) {
            res.status(401).json({ message: "Invalid email or password!" });
            return;
        }
        //compare passwords
        const isPasswordValid = yield bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(401).json({ message: "Invalid email or password" });
            return;
        }
        //checking if JWT is defined before using it
        if (!JWT_SECRET) {
            res.status(500).json({ message: "JWT_SECRET is not defined" });
            return;
        }
        const token = jsonwebtoken_1.default.sign({
            id: user.id,
            role: user.role,
        }, JWT_SECRET, {
            expiresIn: "5d",
        });
        res.status(200).json({ message: "Sign-in successfully", token, user });
        // console.log("TOKEN:", token);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal server error." });
    }
});
exports.signIn = signIn;
//# sourceMappingURL=auth.js.map