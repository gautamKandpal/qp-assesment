import { RequestHandler } from "express";
import prisma from "../prisma/client";

export const createOrder: RequestHandler = async (req, res) => {
  const {
    userId,
    items,
  }: { userId: number; items: { groceryItemId: number; quantity: number }[] } =
    req.body;

  try {
    //filtering in the basis of userId
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    //create the order
    const order = await prisma.order.create({
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

    let total: number = 0;
    // iterates over the values
    for (let item of items) {
      const groceryItem = await prisma.groceryItem.findUnique({
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

      await prisma.orderItem.updateMany({
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
    await prisma.order.update({
      where: { id: order.id },
      data: {
        total,
      },
    });

     res
      .status(201)
      .json({ message: "Order placed successfully", order });
    return;
  } catch (err) {
    console.log("Error placing order:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
