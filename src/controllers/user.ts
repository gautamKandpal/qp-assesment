import { RequestHandler } from "express";
import prisma from "../prisma/client";

export const createGroceryItem: RequestHandler = async (req, res) => {
  const { name, description, price } = req.body;

  try {
    const newItem = await prisma.groceryItem.create({
      data: {
        name,
        description,
        price,
      },
    });
    res.status(201).json({
      message: "item added sucessfully",
      item: newItem,
    });
  } catch (err) {
    console.log("Error creating grocery item", err);
    res.status(500).json({ err: "failed to create grocery item" });
  }
};
