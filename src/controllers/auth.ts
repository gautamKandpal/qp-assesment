import { RequestHandler } from "express";
import prisma from "../prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Role } from "@prisma/client";
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

export const signUp: RequestHandler = async (req, res) => {
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
    if (role && !Object.values(Role).includes(role)) {
      res.status(400).json({ message: "Invalid role specified." });
      return;
    }

    // Check if email is already in use
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      res.status(409).json({ message: "Email is already in use." });
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role || Role.USER,
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
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error." });
  }
};

export const signIn: RequestHandler = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(401).json({ message: "Invalid email or password!" });
      return;
    }

    //compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }

    //checking if JWT is defined before using it
    if (!JWT_SECRET) {
      res.status(500).json({ message: "JWT_SECRET is not defined" });
      return;
    }

    const token = jwt.sign(
      {
        id: user.id,
        // email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      {
        expiresIn: "5d",
      }
    );
    res.status(200).json({ message: "Sign-in successfully", token, user });
    // console.log("TOKEN:", token);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error." });
  }
};
