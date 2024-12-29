import { RequestHandler } from "express";
import prisma from "../prisma/client";

// ADMIN
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
      newItem,
    });
  } catch (err) {
    console.log("Error creating grocery item", err);
    res.status(500).json({ err: "failed to create grocery item" });
  }
};

export const deleteGroceryItem: RequestHandler = async (req, res) => {
  const { id } = req.params;
  try {
    if (!id) {
      res.status(400).json({
        message: "ID is required to delete a grocery item",
      });
      return;
    }

    const existItem = await prisma.groceryItem.findUnique({
      where: { id: Number(id) },
    });
    if (!existItem) {
      res.status(404).json({ message: "Grocery item not found" });
      return;
    }

    const removedItem = await prisma.groceryItem.delete({
      where: { id: Number(id) },
    });

    res.status(200).json({
      message: "Grocery item removed successfully",
      removedItem,
    });
  } catch (err) {
    console.log("Failed to delete grocery item: ", err);
    res.status(500).json({ error: "Failed to delete grocery item" });
  }
};

export const getGroceryItem: RequestHandler = async (req, res) => {
  try {
    const items = await prisma.groceryItem.findMany();
    res.status(200).json(items);
  } catch (err) {
    console.log("Error getting the grocery item", err);
    res.status(500).json({ err: "failed to get the grocery item" });
  }
};

export const updateGroceryItem: RequestHandler = async (req, res) => {
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

    const existingItem = await prisma.groceryItem.findUnique({
      where: { id: Number(id) },
    });
    if (!existingItem) {
      res.status(404).json({ message: "Grocery item not found" });
      return;
    }

    // update the item
    const updatedItem = await prisma.groceryItem.update({
      where: { id: Number(id) },
      data: {
        ...(name && { name }),
        ...(description && { description }),
        ...(price && { price }),
      },
    });
    res.status(200).json({ message: "Item updated sucessfully", updatedItem });
  } catch (err) {
    console.log("Error updating the the grocery item", err);
    res.status(500).json;
  }
};
