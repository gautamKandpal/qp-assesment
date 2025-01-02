import { RequestHandler } from "express";
import prisma from "../prisma/client";

export const createOrder: RequestHandler = async (req, res) => {
  const { userId, items } = req.body; // items: [{ groceryItemId, quantity }]

  try {
    // Validate the user
    const user = await prisma.user.findUnique({
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
      const groceryItem = await prisma.groceryItem.findUnique({
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
    const order = await prisma.order.create({
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
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};
