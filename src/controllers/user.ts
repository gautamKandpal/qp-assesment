import { RequestHandler } from "express";

export const getUser: RequestHandler = (req, res) => {
  res.send("hello world");
};
